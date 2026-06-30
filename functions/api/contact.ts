export async function onRequestPost() {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Thank you for your message. We will be in touch soon.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
