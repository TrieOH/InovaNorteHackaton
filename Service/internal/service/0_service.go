package service

import (
	"GreetService/internal/repository"
)

type GreetService struct {
	queries *repository.Queries
}

func NewGreetService(queries *repository.Queries) *GreetService {
	return &GreetService{queries: queries}
}

