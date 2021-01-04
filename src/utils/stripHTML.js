export default function stripHTML( string ) {
	return string.replace( /<\/?[^>]+(>|$)/g, '' );
}
