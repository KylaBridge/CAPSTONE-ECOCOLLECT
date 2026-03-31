import html2canvas from "html2canvas";

async function waitForImages(root) {
  const imgs = root.querySelectorAll("img");
  await Promise.all(
    Array.from(imgs).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        img.onload = () => res();
        img.onerror = () => res();
      });
    }),
  );
}

export async function downloadBadge(element, options = {}) {
  if (!element) throw new Error("No element provided for download");

  const WIDTH = options.width || 900;
  const HEIGHT = options.height || 850;
  const fileName = options.fileName || "badge-certificate.png";
  const scale = window.devicePixelRatio || 1;

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "-10000px";
  wrapper.style.width = `${WIDTH}px`;
  wrapper.style.height = `${HEIGHT}px`;
  wrapper.style.overflow = "hidden";
  wrapper.style.pointerEvents = "none";
  wrapper.style.opacity = "0";
  wrapper.style.zIndex = "99999";

  try {
    const clone = element.cloneNode(true);
    // Enforce fixed dimensions on the clone to avoid responsive CSS transforms
    clone.style.width = `${WIDTH}px`;
    clone.style.height = `${HEIGHT}px`;
    clone.style.boxSizing = "border-box";
    clone.style.margin = "0";
    clone.style.display = "block";

    const template = clone.querySelector(".share-card-template") || clone;
    try {
      template.style.transform = "none";
      template.style.width = `${WIDTH}px`;
      template.style.height = `${HEIGHT}px`;
      template.style.maxWidth = `${WIDTH}px`;
      template.style.maxHeight = `${HEIGHT}px`;
      template.style.boxSizing = "border-box";
    } catch (e) {
      // ignore if styles can't be applied
    }

    // Ensure <img> tags have their src set
    const originalImgs = element.querySelectorAll("img");
    const cloneImgs = clone.querySelectorAll("img");
    cloneImgs.forEach((img, i) => {
      const src = originalImgs[i]?.src || img.getAttribute("src") || img.getAttribute("data-src");
      if (src) img.src = src;
    });

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    await waitForImages(wrapper);

    const canvas = await html2canvas(clone, {
      backgroundColor: null,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: WIDTH,
      height: HEIGHT,
      scale,
      windowWidth: Math.max(document.documentElement.clientWidth, WIDTH),
      windowHeight: Math.max(document.documentElement.clientHeight, HEIGHT),
    });

    // Trigger download
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { canvas };
  } finally {
    if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
  }
}

export default downloadBadge;
