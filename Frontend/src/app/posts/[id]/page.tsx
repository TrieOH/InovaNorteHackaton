import PostDetails from "@/components/post/PostDetails";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function PostIDPage(props: Props) {
  const { id } = await props.params;
  return (
    <section className="flex justify-center mt-5">
      <PostDetails id={id}/>
    </section>
  )
}