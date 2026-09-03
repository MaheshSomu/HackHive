package com.hackhive.auth.util;

import java.time.Year;
import java.util.List;

public class EmailTemplateBuilder {

    public record KeyValueRow(String label, String value, boolean isHtmlValue) {
        public KeyValueRow(String label, String value) {
            this(label, value, false);
        }
    }

    /**
     * Builds standard responsive HTML container for HackHive emails.
     */
    public static String buildEmailHtml(
            String badgeText,
            String title,
            String greeting,
            String contentText,
            List<KeyValueRow> detailsRows,
            String ctaText,
            String ctaUrl,
            String noteText
    ) {
        StringBuilder html = new StringBuilder();

        html.append("""
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>HackHive Email</title>
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f8fafc;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    table {
                        border-collapse: collapse;
                    }
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8fafc;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 32px 16px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px;">
                                <!-- Header -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="left">
                                                    <span style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                                        Hack<span style="color: #2563eb;">Hive</span>
                                                    </span>
                                                </td>
                                                <td align="right">
                                                    <span style="font-size: 11px; font-weight: 700; color: #475569; background-color: #e2e8f0; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            """);

        html.append(escapeHtml(badgeText != null ? badgeText : "Notification"));

        html.append("""
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Main Body Card -->
                                <tr>
                                    <td>
                                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px;">
                                            <tr>
                                                <td>
            """);

        if (title != null && !title.isBlank()) {
            html.append("<h1 style=\"font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">")
                .append(escapeHtml(title))
                .append("</h1>");
        }

        if (greeting != null && !greeting.isBlank()) {
            html.append("<p style=\"font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">")
                .append(escapeHtml(greeting))
                .append("</p>");
        }

        if (contentText != null && !contentText.isBlank()) {
            html.append("<p style=\"font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">")
                .append(contentText)
                .append("</p>");
        }

        // Details Table / Key-Value Section
        if (detailsRows != null && !detailsRows.isEmpty()) {
            html.append("""
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin: 20px 0 24px 0; border-collapse: separate; border-spacing: 0; overflow: hidden;">
            """);

            for (int i = 0; i < detailsRows.size(); i++) {
                KeyValueRow row = detailsRows.get(i);
                boolean isLast = (i == detailsRows.size() - 1);
                String borderStyle = isLast ? "" : "border-bottom: 1px solid #e2e8f0;";

                html.append("<tr>");
                html.append("<td style=\"padding: 12px 16px; ").append(borderStyle).append(" font-size: 13px; font-weight: 600; color: #475569; width: 38%; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">");
                html.append(escapeHtml(row.label()));
                html.append("</td>");
                html.append("<td style=\"padding: 12px 16px; ").append(borderStyle).append(" font-size: 13px; color: #0f172a; text-align: right; vertical-align: top; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">");
                if (row.isHtmlValue()) {
                    html.append(row.value());
                } else {
                    html.append(escapeHtml(row.value()));
                }
                html.append("</td>");
                html.append("</tr>");
            }

            html.append("</table>");
        }

        // Primary CTA Button
        if (ctaText != null && !ctaText.isBlank() && ctaUrl != null && !ctaUrl.isBlank()) {
            html.append("""
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                    <tr>
                        <td align="center" style="border-radius: 6px; background-color: #2563eb;">
                            <a href="
            """).append(escapeHtml(ctaUrl)).append("""
                " target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; border: 1px solid #2563eb; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            """).append(escapeHtml(ctaText)).append("""
                            </a>
                        </td>
                    </tr>
                </table>
            """);

            // Raw URL Fallback Box
            html.append("""
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-top: 20px; word-break: break-all;">
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 4px 0; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Or copy and paste this link into your browser:</p>
                    <a href="
            """).append(escapeHtml(ctaUrl)).append("""
                " style="font-size: 12px; color: #2563eb; text-decoration: underline; word-break: break-all; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            """).append(escapeHtml(ctaUrl)).append("""
                    </a>
                </div>
            """);
        }

        // Note Box (expiration / security advice)
        if (noteText != null && !noteText.isBlank()) {
            html.append("""
                <div style="background-color: #f8fafc; border-left: 4px solid #94a3b8; border-radius: 0 6px 6px 0; padding: 12px 16px; margin-top: 20px;">
                    <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            """).append(escapeHtml(noteText)).append("""
                    </p>
                </div>
            """);
        }

        html.append("""
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding-top: 28px; text-align: center;">
                                        <p style="font-size: 12px; color: #94a3b8; margin: 0 0 6px 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                            This is an automated message from HackHive. Please do not reply directly to this email.
                                        </p>
                                        <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                            &copy; 
            """);

        html.append(Year.now().getValue());

        html.append("""
                                            HackHive. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """);

        return html.toString();
    }

    private static String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
