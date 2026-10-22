const filterButtons = document.querySelectorAll(".filter-btn");
const certificateGallery = document.getElementById("certificateGallery");
const certificateItems = certificateGallery
    ? Array.from(certificateGallery.querySelectorAll(".certificate-item"))
    : [];
const certificatePagination = document.getElementById("certificatePagination");
const certificatePrevious = document.getElementById("certificatePrevious");
const certificateNext = document.getElementById("certificateNext");
const certificatePageStatus = document.getElementById("certificatePageStatus");

if (certificateGallery && certificatePagination && certificatePrevious && certificateNext && certificatePageStatus) {
    let activeCertificateFilter = "webinar";
    let certificatePage = 0;

    function renderCertificates() {
        const filteredItems = certificateItems.filter(item =>
            activeCertificateFilter === "all" || item.dataset.category === activeCertificateFilter
        );
        const columns = window.matchMedia("(min-width: 992px)").matches
            ? 3
            : window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
        const pageSize = columns;
        const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
        certificatePage = Math.min(certificatePage, pageCount - 1);

        const firstItem = certificatePage * pageSize;
        const visibleItems = new Set(filteredItems.slice(firstItem, firstItem + pageSize));

        certificateItems.forEach(item => {
            item.style.display = visibleItems.has(item) ? "" : "none";
        });

        const hasMultiplePages = pageCount > 1;
        certificatePagination.classList.toggle("single-page", !hasMultiplePages);
        certificatePrevious.hidden = !hasMultiplePages || certificatePage === 0;
        certificateNext.hidden = !hasMultiplePages;
        certificatePageStatus.hidden = !hasMultiplePages;
        certificatePageStatus.textContent = `${certificatePage + 1} of ${pageCount}`;
        certificatePrevious.disabled = certificatePage === 0;
        certificateNext.disabled = certificatePage >= pageCount - 1;
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(filterButton => filterButton.classList.remove("active"));
            button.classList.add("active");
            activeCertificateFilter = button.dataset.filter || "all";
            certificatePage = 0;
            renderCertificates();
        });
    });

    certificatePrevious.addEventListener("click", () => {
        if (certificatePage > 0) {
            certificatePage -= 1;
            renderCertificates();
        }
    });

    certificateNext.addEventListener("click", () => {
        certificatePage += 1;
        renderCertificates();
    });

    window.addEventListener("resize", renderCertificates);
    renderCertificates();
}

const certificateButtons = document.querySelectorAll(".view-certificate");

const modalImage = document.getElementById("modalCertificateImage");

const certificateModalElement = document.getElementById("certificateModal");

const certificateModal = new bootstrap.Modal(certificateModalElement);

certificateButtons.forEach(button => {

    button.addEventListener("click", function () {

        const imagePath = this.getAttribute("data-image");

        modalImage.src = imagePath;

        certificateModal.show();

    });

});

const projectModalElement = document.getElementById("projectModal");

if (projectModalElement) {
    const projectModal = bootstrap.Modal.getOrCreateInstance(projectModalElement);
    const projectModalTitle = document.getElementById("projectModalTitle");
    const projectModalType = document.getElementById("projectModalType");
    const projectModalDescription = document.getElementById("projectModalDescription");
    const projectModalDetails = document.getElementById("projectModalDetails");
    const projectCarouselElement = document.getElementById("projectCarousel");

    function createCarouselControl(direction, label) {
        const control = document.createElement("button");
        control.type = "button";
        control.className = `carousel-control-${direction}`;
        control.setAttribute("data-bs-target", "#projectCarousel");
        control.setAttribute("data-bs-slide", direction === "prev" ? "prev" : "next");
        control.setAttribute("aria-label", label);

        const icon = document.createElement("span");
        icon.className = `carousel-control-${direction}-icon`;
        icon.setAttribute("aria-hidden", "true");
        control.append(icon);
        return control;
    }

    document.querySelectorAll(".project-card").forEach(project => {
        const previewButton = project.querySelector(".project-preview");
        const screenshotTemplate = project.querySelector(".project-screenshots");
        const screenshots = screenshotTemplate
            ? Array.from(screenshotTemplate.content.querySelectorAll("img"))
            : [];
        const projectName = project.querySelector(".project-content h3")?.textContent.trim();

        if (!previewButton || !projectName) {
            return;
        }

        if (screenshots.length > 0) {
            const previewImage = screenshots[0].cloneNode();
            previewImage.className = "project-preview-image";
            previewButton.replaceChildren(
                previewImage,
                ...Array.from(previewButton.querySelectorAll(".project-preview-action"))
            );
        }

        previewButton.setAttribute("aria-label", `View ${projectName} project`);
        previewButton.addEventListener("click", () => {
            const content = project.querySelector(".project-content");
            const projectType = content.querySelector(".project-type");
            const description = content.querySelector(".project-description");
            const details = content.querySelector(".project-details");

            projectModalTitle.textContent = projectName;
            projectModalType.textContent = projectType?.textContent.trim() || "";
            projectModalDescription.textContent = description?.textContent.trim() || "";
            projectModalDetails.replaceChildren(
                ...(details ? [details.cloneNode(true)] : [])
            );
            projectCarouselElement.replaceChildren();

            const carouselInner = document.createElement("div");
            carouselInner.className = "carousel-inner";

            const slides = screenshots.length > 0 ? screenshots : [null];
            slides.forEach((screenshot, index) => {
                const item = document.createElement("div");
                item.className = `carousel-item${index === 0 ? " active" : ""}`;

                if (screenshot) {
                    const image = screenshot.cloneNode();
                    image.className = "project-slide-image";
                    item.append(image);
                } else {
                    const placeholder = document.createElement("div");
                    placeholder.className = "project-image-placeholder project-slide-placeholder";

                    const icon = document.createElement("i");
                    icon.className = "bi bi-images";
                    icon.setAttribute("aria-hidden", "true");

                    const message = document.createElement("span");
                    message.textContent = "Add project screenshots in this project's HTML card.";

                    placeholder.append(icon, message);
                    item.append(placeholder);
                }

                carouselInner.append(item);
            });

            projectCarouselElement.append(carouselInner);

            if (screenshots.length > 1) {
                const indicators = document.createElement("div");
                indicators.className = "carousel-indicators";

                screenshots.forEach((_, index) => {
                    const indicator = document.createElement("button");
                    indicator.type = "button";
                    indicator.setAttribute("data-bs-target", "#projectCarousel");
                    indicator.setAttribute("data-bs-slide-to", String(index));
                    indicator.setAttribute("aria-label", `Show project screen ${index + 1}`);

                    if (index === 0) {
                        indicator.className = "active";
                        indicator.setAttribute("aria-current", "true");
                    }

                    indicators.append(indicator);
                });

                projectCarouselElement.append(
                    indicators,
                    createCarouselControl("prev", "Previous project screenshot"),
                    createCarouselControl("next", "Next project screenshot")
                );
            }

            bootstrap.Carousel.getInstance(projectCarouselElement)?.dispose();
            if (screenshots.length > 1) {
                bootstrap.Carousel.getOrCreateInstance(projectCarouselElement, {
                    interval: false
                });
            }

            projectModal.show();
        });
    });
}

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

const navbar = document.querySelector(".navbar");

function updateActiveSection() {
    const navbarHeight = `${navbar.offsetHeight}px`;

    if (document.documentElement.style.scrollPaddingTop !== navbarHeight) {
        document.documentElement.style.scrollPaddingTop = navbarHeight;
    }

    if (document.documentElement.style.getPropertyValue("--navbar-height") !== navbarHeight) {
        document.documentElement.style.setProperty("--navbar-height", navbarHeight);
    }

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            currentSection = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {

            link.classList.add("active");

        }

    });

    navbar.classList.toggle("navbar-home", currentSection === "home");
}

window.addEventListener("scroll", updateActiveSection);
window.addEventListener("resize", updateActiveSection);

updateActiveSection();

const navbarCollapse = document.getElementById("navbarMenu");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        if (navbarCollapse.classList.contains("show")) {

            const collapse = bootstrap.Collapse.getOrCreateInstance(
                navbarCollapse,
                { toggle: false }
            );

            collapse.hide();

        }

    });

});
