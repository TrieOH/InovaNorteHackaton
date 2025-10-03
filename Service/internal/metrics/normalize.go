package metrics

import (
	"net/http"
	"strings"
)

func normalizePath(r *http.Request) string {
	path := r.URL.Path

	if strings.HasPrefix(path, "/greet/") {
		if r.PathValue("greeting_id") != "" {
			return "/greet/{id}/{greeting_id}"
		}
		if r.PathValue("id") != "" {
			return "/greet/{id}"
		}
	}

	if strings.HasPrefix(path, "/users/") {
		if r.PathValue("id") != "" {
			return "/users/{id}"
		}
	}

	return path
}
