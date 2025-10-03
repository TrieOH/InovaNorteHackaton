package handler

import (
	"GreetService/internal/models"
	resp "github.com/MintzyG/GoResponse/response"
	"github.com/spf13/viper"
	"net/http"
)

// GreetByID godoc
// @Description Greets a user
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} models.Greeting
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /greet/{id} [post]
func (h *GreetHandler) GreetById(w http.ResponseWriter, r *http.Request) {
	user, rs := h.GreetService.GetUserById(r.Context(), r.PathValue("id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(models.Greeting{Greeting: "Hello " + user.FirstName + " " + *user.LastName}).Send(w)
}

// GreetAll godoc
// @Description Greets all users in the system
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {array} string
// @Failure 500 {object} models.ErrorResponse
// @Router /greet [post]
func (h *GreetHandler) GreetAll(w http.ResponseWriter, r *http.Request) {
	greets, rs := h.GreetService.GreetAll(r.Context())
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(greets).Send(w)
}

// SpecialGreetById godoc
// @Description Greets a user with a special greeting from SpecialGreetingService
// @Description Only available if SpecialGreetingService is available
// @Tags users
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Param greeting_id path string true "Greeting ID"
// @Success 200 {object} models.Greeting
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /greet/{user_id}/{greeting_id} [post]
func (h *GreetHandler) SpecialGreetById(w http.ResponseWriter, r *http.Request) {
	sgsu := viper.GetString("SPECIAL_GREETING_SERVICE_URL")
	response, err := http.Get("http://" + sgsu + ":8080/greetings/" + r.PathValue("greeting_id"))
	if err != nil {
		resp.InternalServerError("Could not fetch special greeting").AddTrace(err).Send(w)
		return
	}

	var greet models.Greeting
	_, err = resp.ExtractData(response, &greet)
	if err != nil {
		resp.InternalServerError("Could not extract data from response").AddTrace(err).Send(w)
		return
	}

	user, rs := h.GreetService.GetUserById(r.Context(), r.PathValue("id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(models.Greeting{Greeting: greet.Greeting + " " + user.FirstName + " " + *user.LastName}).Send(w)
}
