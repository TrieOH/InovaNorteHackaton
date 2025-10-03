package models

type CreateUserRequest struct {
	FirstName string  `json:"first_name,omitempty" validate:"required"`
	LastName  *string `json:"last_name,omitempty"`
}
