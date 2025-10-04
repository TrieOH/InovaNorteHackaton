package open_router

import (
	"context"
	"log"
	openrouter "github.com/revrost/go-openrouter"
)

var Client *openrouter.Client

func AiComment(name, title, content string, Comment *string) {
	log.Println("Asking the AI for a comment")
	var message string
	if name != "" {
		message = "Você é um ajudante da empresa Sicoob, uma empresa de linha de crédito, está é uma plataforma de perguntas e respostas para educação financeira e comunidade, seja o de mais ajuda possível no seu comentário e tente sanar as duvidas dos usuários, não fuja dessa ordem, apenas fale em português, tente que sua resposta não seja muito pequena, você está falando com o usuário de nome: " + name + " abra sua mensagem com um comprimento legal, não ofereça ajuda continua, tente resolver a duvida em uma mensagem só e finalize com algo similar a espero que tenha ajudado, não se coloque a disposição essa é pra ser a primeira e ultima mensagem da sua interação com essa pessoa"
	} else {
		message = "Você é um ajudante da empresa Sicoob, uma empresa de linha de crédito, está é uma plataforma de perguntas e respostas para educação financeira e comunidade, seja o de mais ajuda possível no seu comentário e tente sanar as duvidas dos usuários, não fuja dessa ordem, apenas fale em português, tente que sua resposta não seja muito pequena, abra sua mensagem com um comprimento legal, não ofereça ajuda continua, tente resolver a duvida em uma mensagem só e finalize com algo similar a espero que tenha ajudado, não se coloque a disposição essa é pra ser a primeira e ultima mensagem da sua interação com essa pessoa"
	}
	ctx := context.Background()
	resp, err := Client.CreateChatCompletion(
		ctx,
		openrouter.ChatCompletionRequest{
			Model: "deepseek/deepseek-chat-v3.1:free",
			Messages: []openrouter.ChatCompletionMessage{
				{
					Role:    openrouter.ChatMessageRoleSystem,
					Content: openrouter.Content{Text: message},
				},
				{
					Role:    openrouter.ChatMessageRoleUser,
					Content: openrouter.Content{Text: title + ": " + content},
				},
			},
			Stream: false,
		},
	)

	if err != nil {
		log.Println("error", err)
	} else {
		*Comment = resp.Choices[0].Message.Content.Text
		log.Printf("%v\n", resp.Choices[0].Message.Content.Text)
	}
}
