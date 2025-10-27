function status(request, response) {
  response.status(200).json({ chave: "a" });
}

export default status;
