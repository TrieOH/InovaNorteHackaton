package service

import (
	"context"
	resp "github.com/MintzyG/GoResponse/response"
)

func (h *GreetService) GreetAll(ctx context.Context) ([]string, *resp.Response) {
	users, err := h.queries.GetAllUsers(ctx)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all users").AddTrace(err)
	}

	var greetings []string
	for _, u := range users {
		if u.LastName == nil {
			greetings = append(greetings, "greetings "+u.FirstName)
		} else {
			greetings = append(greetings, "greetings "+u.FirstName+" "+*u.LastName)
		}
	}

	return greetings, nil
}
