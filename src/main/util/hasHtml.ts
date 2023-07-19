export default function hasHtml (input: string) {
    const container = document.createElement("div");
    container.innerHTML = input;
    return container.childElementCount>0;
}