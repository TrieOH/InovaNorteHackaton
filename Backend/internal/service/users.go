package service

import (
	"GreetService/internal/models"
	"GreetService/internal/repository"
	"context"
	resp "github.com/MintzyG/GoResponse/response"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
)

func (h *UserService) CreateUser(ctx context.Context, req models.CreateUserRequest) (*models.UserDTO, *resp.Response) {
	dbUser, err := h.queries.CreateUser(ctx, repository.CreateUserParams{
		Name: req.Name,
		Username:  req.Username,
		Email:  req.Email,
		Password:  req.Password,
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

func (h *UserService) UpdateUser(ctx context.Context, user_id string, req models.UpdateUserRequest) (*models.UserDTO, *resp.Response) {
	if user_id == "" {
		return nil, resp.BadRequest("id is required")
	}

	uuid, err := uuid.Parse(user_id)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	user, err := h.queries.GetUserByID(ctx, uuid)
	if err != nil {
		return nil, resp.InternalServerError("failed to get user").AddTrace(err)
	}

	var newUser models.UserDTO
	if req.Name == "" {
    newUser.Name = user.Name
	}
	if req.Username == "" {
    newUser.Username = user.Username
	}
	if req.Email == "" {
    newUser.Email = user.Email
	}

	dbUser, err := h.queries.UpdateUser(ctx, repository.UpdateUserParams{
		Name: newUser.Name,
		Username:  newUser.Username,
		Email:  newUser.Email,
	})
	if err != nil {
		return nil, resp.InternalServerError("failed to update user").AddTrace(err)
	}

	var userDTO models.UserDTO
	if err := copier.Copy(&userDTO, &dbUser); err != nil {
		return nil, resp.InternalServerError("failed to create userDTO").AddTrace(err)
	}

	return &userDTO, nil
}

func (h *UserService) DeleteUser(ctx context.Context, user_id string) *resp.Response {
	if user_id == "" {
		return resp.BadRequest("id is required")
	}

	uuid, err := uuid.Parse(user_id)
	if err != nil {
		return resp.BadRequest("invalid uuid").AddTrace(err)
	}

	user, err := h.queries.GetUserByID(ctx, uuid)
	if err != nil {
		return resp.InternalServerError("failed to get user").AddTrace(err)
	}

	err = h.queries.DeleteUser(ctx, user.ID)
	if err != nil {
		return resp.InternalServerError("failed to delete user").AddTrace(err)
	}

	return nil
}

func (h *UserService) GetUserById(ctx context.Context, id string) (*models.UserDTO, *resp.Response) {
	if id == "" {
		return nil, resp.BadRequest("id is required")
	}

	uuid, err := uuid.Parse(id)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	dbUser, err := h.queries.GetUserByID(ctx, uuid)
	if err != nil {
		return nil, resp.InternalServerError("failed to get user").AddTrace(err)
	}

	var userDTO models.UserDTO
	if err := copier.Copy(&userDTO, &dbUser); err != nil {
		return nil, resp.InternalServerError("failed to create userDTO").AddTrace(err)
	}

	return &userDTO, nil
}

func (h *UserService) ListUsers(ctx context.Context) ([]models.UserDTO, *resp.Response) {
	users, err := h.queries.ListUsers(ctx)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all users").AddTrace(err)
	}

	var usersDTO []models.UserDTO
	if err := copier.Copy(&usersDTO, &users); err != nil {
		return nil, resp.InternalServerError("failed to create usersDTO").AddTrace(err)
	}

	return usersDTO, nil
}
