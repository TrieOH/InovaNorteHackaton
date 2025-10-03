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
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req models.CreateUserRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	user, rs := h.UserService.CreateUser(r.Context(), req)
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Created " + user.Username).WithData(user).Send(w)
}

// GetUserByID godoc
// @Description Gets a user
// @Tags users
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {object} models.UserDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id} [get]
func (h *UserHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	user, rs := h.UserService.GetUserById(r.Context(), r.PathValue("user_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(user).Send(w)
}

// UpdateUser godoc
// @Description Updates a user
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.UpdateUserRequest true "User info"
// @Param id path string true "User ID"
// @Success 200 {object} models.UserDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id} [patch]
func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	var req models.UpdateUserRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	user, rs := h.UserService.UpdateUser(r.Context(), r.PathValue("user_id"), req)
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Updated " + user.Username).WithData(user).Send(w)
}

// DeleteUser godoc
// @Description Delete a user
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id} [delete]
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	rs := h.UserService.DeleteUser(r.Context(), r.PathValue("user_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Deleted User").Send(w)
}

// ListUsers godoc
// @Description List all users in the system
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {array} models.UserDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /users [get]
func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, rs := h.UserService.ListUsers(r.Context())
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(users).Send(w)
}

