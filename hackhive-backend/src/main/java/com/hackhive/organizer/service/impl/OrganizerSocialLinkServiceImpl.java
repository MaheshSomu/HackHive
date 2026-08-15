package com.hackhive.organizer.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.organizer.dto.request.OrganizerSocialLinkRequest;
import com.hackhive.organizer.dto.response.OrganizerSocialLinkResponse;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.entity.OrganizerSocialLink;
import com.hackhive.organizer.enums.SocialPlatform;
import com.hackhive.organizer.mapper.OrganizerSocialLinkMapper;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.organizer.repository.OrganizerSocialLinkRepository;
import com.hackhive.organizer.service.OrganizerSocialLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizerSocialLinkServiceImpl implements OrganizerSocialLinkService {

    private final OrganizerSocialLinkRepository organizerSocialLinkRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final OrganizerSocialLinkMapper organizerSocialLinkMapper;

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }

    private OrganizerProfile getCurrentOrganizerProfile() {
        User user = getCurrentUser();

        return organizerProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Organizer profile not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrganizerSocialLinkResponse> getMySocialLinks() {
        OrganizerProfile profile = getCurrentOrganizerProfile();

        return organizerSocialLinkRepository.findByOrganizerProfile(profile)
                .stream()
                .map(organizerSocialLinkMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrganizerSocialLinkResponse saveSocialLink(OrganizerSocialLinkRequest request) {
        OrganizerProfile profile = getCurrentOrganizerProfile();

        if (request.getPlatform() == null) {
            throw new BadRequestException("Social platform is required.");
        }

        String rawUrl = request.getUrl();
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            throw new BadRequestException("URL cannot be empty.");
        }

        String normalizedUrl = rawUrl.trim();
        validateSocialUrl(request.getPlatform(), normalizedUrl);

        Optional<OrganizerSocialLink> existingLinkOpt =
                organizerSocialLinkRepository.findByOrganizerProfileAndPlatform(profile, request.getPlatform());

        OrganizerSocialLink socialLink;
        if (existingLinkOpt.isPresent()) {
            socialLink = existingLinkOpt.get();
            socialLink.setUrl(normalizedUrl);
        } else {
            socialLink = OrganizerSocialLink.builder()
                    .organizerProfile(profile)
                    .platform(request.getPlatform())
                    .url(normalizedUrl)
                    .build();
        }

        socialLink = organizerSocialLinkRepository.save(socialLink);

        return organizerSocialLinkMapper.toResponse(socialLink);
    }

    @Override
    @Transactional
    public void deleteSocialLink(Long id) {
        OrganizerProfile profile = getCurrentOrganizerProfile();

        OrganizerSocialLink socialLink = organizerSocialLinkRepository.findByIdAndOrganizerProfile(id, profile)
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found."));

        organizerSocialLinkRepository.delete(socialLink);
    }

    @Override
    @Transactional
    public void deleteSocialLinkByPlatform(SocialPlatform platform) {
        OrganizerProfile profile = getCurrentOrganizerProfile();

        Optional<OrganizerSocialLink> existingLinkOpt =
                organizerSocialLinkRepository.findByOrganizerProfileAndPlatform(profile, platform);

        existingLinkOpt.ifPresent(organizerSocialLinkRepository::delete);
    }

    private void validateSocialUrl(SocialPlatform platform, String url) {
        String lowerUrl = url.toLowerCase();

        if (!lowerUrl.startsWith("http://") && !lowerUrl.startsWith("https://")) {
            throw new BadRequestException("URL must start with http:// or https://");
        }

        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host == null) {
                throw new BadRequestException("Invalid URL format.");
            }

            String lowerHost = host.toLowerCase();
            boolean validHost = false;

            switch (platform) {
                case LINKEDIN:
                    validHost = lowerHost.equals("linkedin.com") || lowerHost.endsWith(".linkedin.com");
                    break;
                case GITHUB:
                    validHost = lowerHost.equals("github.com") || lowerHost.endsWith(".github.com");
                    break;
                case X:
                    validHost = lowerHost.equals("x.com") || lowerHost.endsWith(".x.com")
                            || lowerHost.equals("twitter.com") || lowerHost.endsWith(".twitter.com");
                    break;
                case INSTAGRAM:
                    validHost = lowerHost.equals("instagram.com") || lowerHost.endsWith(".instagram.com");
                    break;
                case FACEBOOK:
                    validHost = lowerHost.equals("facebook.com") || lowerHost.endsWith(".facebook.com");
                    break;
            }

            if (!validHost) {
                throw new BadRequestException("URL host must match " + platform.name() + " domain.");
            }
        } catch (Exception e) {
            if (e instanceof BadRequestException) {
                throw (BadRequestException) e;
            }
            throw new BadRequestException("Invalid URL for " + platform.name() + ": " + url);
        }
    }
}
