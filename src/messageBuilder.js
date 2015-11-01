import Message from "./message";

export default function messageBuilder() {
  return new Message(...arguments)
}
