import { ChannelType } from "discord.js";

const forumId = process.env.FORUM_ID;

export async function createForumPost(client, postData) {
  if (!postData || !postData.title || !postData.content) {
    console.error('[ForumService] Error: Invalid data for post creation. A post needs a title and content.');
    return null;
  }

  if (!forumId) {
    console.error('[ForumService] Error: Cant find forum ID.');
    return null;
  }

  try {
    const forumChannel = await client.channels.fetch(forumId);

    if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
      console.error(`[ForumService] Error: Channel not founded or it's not a forum.`);
      return null;
    }

    const post = await forumChannel.threads.create({
      name: postData.title,
      message: {
        content: postData.content,
      },
    });

    console.log(`[ForumService] Post created with ${postData.title}`);
    return post;

  } catch (error) {
    console.error(`[ForumService] Error trying to create post`, error);
    return null;
  }
}
