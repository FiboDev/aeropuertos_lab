const toolsContainer = document.getElementById("tools-container");
const tool = document.querySelector(".tool");

const prevButton = document.getElementById("control-prev");
const nextButton = document.getElementById("control-next");

nextButton.addEventListener("click", () => {
    const toolWidth = tool.clientWidth;
    toolsContainer.scrollLeft += toolWidth;
});

prevButton.addEventListener("click", () => {
    const toolWidth = tool.clientWidth;
    toolsContainer.scrollLeft -= toolWidth;
});
  