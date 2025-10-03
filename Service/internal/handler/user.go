package handler

import (
	"GreetService/internal/models"
	"GreetService/internal/validation"
	resp "github.com/MintzyG/GoResponse/response"
	"net/http"
)

// CreateUser godoc
// @Description Creates a new user
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.CreateUserRequest true "User info"
// @Success 201 {object} models.UserDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users [post]
func (h *GreetHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req models.CreateUserRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	user, rs := h.GreetService.CreateUser(r.Context(), req)
	if rs != nil {
		rs.Send(w)
		return
	}

	if user.LastName != nil {
		resp.Created("Created " + user.FirstName + " " + *user.LastName).WithData(user).Send(w)
		return
	}

	resp.Created("Created " + user.FirstName).WithData(user).Send(w)
}

// GetUserByID godoc
// @Description Gets a user
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} models.UserDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{id} [post]
func (h *GreetHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	user, rs := h.GreetService.GetUserById(r.Context(), r.PathValue("id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(user).Send(w)
}

// GetAllUsers godoc
// @Description Gets all users in the system
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {array} models.UserDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /users [get]
func (h *GreetHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, rs := h.GreetService.GetAllUsers(r.Context())
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(users).Send(w)
}

