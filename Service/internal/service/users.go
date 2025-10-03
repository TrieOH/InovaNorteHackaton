package service

import (
	"GreetService/internal/models"
	"GreetService/internal/repository"
	"context"
	resp "github.com/MintzyG/GoResponse/response"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
)

func (h *GreetService) CreateUser(ctx context.Context, req models.CreateUserRequest) (*models.UserDTO, *resp.Response) {
	if req.FirstName == "" {
		return nil, resp.BadRequest("FirstName is required")
	}

	dbUser, err := h.queries.CreateUser(ctx, repository.CreateUserParams{
		FirstName: req.FirstName,
		LastName:  req.LastName,
	})
	if err != nil {
		return nil, resp.InternalServerError("failed to create user").AddTrace(err)
	}

	var userDTO models.UserDTO
	if err := copier.Copy(&userDTO, &dbUser); err != nil {
		return nil, resp.InternalServerError("failed to create userDTO").AddTrace(err)
	}

	return &userDTO, nil
}

func (h *GreetService) GetUserById(ctx context.Context, id string) (*models.UserDTO, *resp.Response) {
	if id == "" {
		return nil, resp.BadRequest("id is required")
	}

	uuid, err := uuid.Parse(id)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	dbUser, err := h.queries.GetUserById(ctx, uuid)
	if err != nil {
		return nil, resp.InternalServerError("failed to get user").AddTrace(err)
	}

	var userDTO models.UserDTO
	if err := copier.Copy(&userDTO, &dbUser); err != nil {
		return nil, resp.InternalServerError("failed to create userDTO").AddTrace(err)
	}

	return &userDTO, nil
}

func (h *GreetService) GetAllUsers(ctx context.Context) ([]models.UserDTO, *resp.Response) {
	users, err := h.queries.GetAllUsers(ctx)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all users").AddTrace(err)
	}

	var usersDTO []models.UserDTO
	if err := copier.Copy(&usersDTO, &users); err != nil {
		return nil, resp.InternalServerError("failed to create usersDTO").AddTrace(err)
	}

	return usersDTO, nil
}
