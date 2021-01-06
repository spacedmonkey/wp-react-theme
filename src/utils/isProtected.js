export default function isProtected( post ) {
	return post.content.protected && ! post.content.rendered;
}
