export function slicedText(text: string, size: number = 30){
  return text.length > size ? text.slice(0, size) + "..." : text;
}