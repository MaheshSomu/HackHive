package com.hackhive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HackhiveBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HackhiveBackendApplication.class, args);
	}

}
