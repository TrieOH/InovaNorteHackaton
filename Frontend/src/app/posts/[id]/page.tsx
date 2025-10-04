
type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostIDPage(props: Props) {
  const { id } = await props.params;
  console.log("fdfw:" + id);
}