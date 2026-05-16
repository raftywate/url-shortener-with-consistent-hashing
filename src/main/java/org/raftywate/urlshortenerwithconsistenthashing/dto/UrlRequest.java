package org.raftywate.urlshortenerwithconsistenthashing.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UrlRequest {

    @NotBlank(message = "URL cannot be empty")
    private String url;

}