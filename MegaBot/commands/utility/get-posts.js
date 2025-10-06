import { SlashCommandBuilder } from "discord.js";
import {
  createForumPost,
  getPostsFromDb,
  getPostsFromDiscordForum,
} from "../../services/forumService.js";

export default {
  data: new SlashCommandBuilder()
    .setName("get-posts")
    .setDescription(
      "Busca por todos os posts feitos no site da SiConn e adiciona como pergunta no fórum"
    ),
  async execute(interaction) {
    await interaction.reply("Processando os posts...");
    const sitePosts = await getPostsFromDb();
    const forumPosts = await getPostsFromDiscordForum(interaction.client);
    let hasAdded = false;
    for (const post of sitePosts) {
      if (!forumPosts.some((forumPost) => forumPost.title === post.title)) {
        await createForumPost(interaction.client, post);
        hasAdded = true;
      }
    }
    if (hasAdded) {
      await interaction.followUp("Post(s) adicionados ao fórum.");
    } else {
      await interaction.followUp("Nenhum novo post encontrado.");
    }
  },
};
