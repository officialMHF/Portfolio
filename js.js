document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const navLinks = document.querySelectorAll('nav a:not(#home-button)');
    const sections = document.querySelectorAll('.section');
    const header = document.getElementById('header');
    const profileImg = document.getElementById('profile-img');
    const homeButton = document.getElementById('home-button');
    const contentContainer = document.getElementById('content-container');
    const hobbyButtons = document.querySelectorAll('.hobby-btn');
    const hobbyInfos = document.querySelectorAll('.hobby-info');
    const nav = document.querySelector('nav');
    const hobbyButtonsContainer = document.querySelector('.hobby-buttons');

    // State variables
    let lastScrollY = window.scrollY;
    let ticking = false;
    let isHobbyActive = false;
    let activeSection = null;


    function updateNavigation() {
        const scrollY = window.scrollY;

        if (isHobbyActive) {
            if (scrollY < 50 && scrollY < lastScrollY) {
                nav.classList.remove('hidden');
            } else {
                nav.classList.add('hidden');
            }
            hobbyButtonsContainer?.classList.remove('hidden');
        } else {
            if (scrollY > lastScrollY && scrollY > 50) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            hobbyButtonsContainer?.classList.add('hidden');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    // Scroll event listener with requestAnimationFrame
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    });

    function resetAllSections() {
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        navLinks.forEach(link => link.classList.remove('active'));
    }

    function showSection(sectionId) {
        resetAllSections();

        if (sectionId) {
            const targetSection = document.getElementById(sectionId);
            const targetLink = document.querySelector(`nav a[data-section="${sectionId}"]`);

            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
                targetLink?.classList.add('active');
            }

            header.classList.add('hidden');
            profileImg.classList.add('hidden');
            contentContainer.style.display = 'block';

            if (sectionId === 'over-mij') {
                const mhfAnimation = targetSection.querySelector('.mhf-animation');
                const aboutContent = targetSection.querySelector('.about-content');
                if (mhfAnimation && aboutContent) {
                    mhfAnimation.style.animation = 'none';
                    aboutContent.style.animation = 'none';
                    setTimeout(() => {
                        mhfAnimation.style.animation = '';
                        aboutContent.style.animation = '';
                    }, 10);
                }
            }

            isHobbyActive = sectionId === 'hobbies';
            if (isHobbyActive) {
                hobbyButtonsContainer?.classList.remove('hidden');
                const activeHobby = document.querySelector('.hobby-info.active');
                if (!activeHobby) {
                    hobbyButtons[0]?.click();
                }
            } else {
                hobbyButtonsContainer?.classList.add('hidden');
            }
        } else {
            header.classList.remove('hidden');
            profileImg.classList.remove('hidden');
            contentContainer.style.display = 'none';
            isHobbyActive = false;
            hobbyButtonsContainer?.classList.add('hidden');
        }

        window.scrollTo(0, 0);
        activeSection = sectionId;
    }

    function updateHobbyTransition() {
        const activeHobbyInfo = document.querySelector('.hobby-info.active');
        if (activeHobbyInfo) {
            const videoSection = activeHobbyInfo.querySelector('.video-section');
            const photoSection = activeHobbyInfo.querySelector('.photo-section');
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;


            const fadeStart = windowHeight * 0.2;
            const fadeEnd = windowHeight * 0.8;


            const rawProgress = (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
            const fadeProgress = Math.min(0.85, Math.max(0, rawProgress));

            if (videoSection) videoSection.style.opacity = Math.max(0.15, 1 - fadeProgress);
            if (photoSection) photoSection.style.opacity = Math.min(0.85, fadeProgress);
        }
    }

    window.addEventListener('scroll', function() {
        if (isHobbyActive) {
            updateHobbyTransition();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    homeButton.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(null);
    });


    hobbyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hobbyNumber = this.getAttribute('data-hobby');


            window.scrollTo(0, 0);


            hobbyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');


            document.querySelectorAll('video').forEach(video => {
                video.pause();
                video.currentTime = 0;
            });


            hobbyInfos.forEach(info => {
                info.classList.remove('active');
                info.style.display = 'none';
                info.style.opacity = '0';
            });


            const targetHobby = document.getElementById(`hobby${hobbyNumber}`);
            if (targetHobby) {
                targetHobby.style.display = 'flex';
                targetHobby.classList.add('active');


                const video = hobbyNumber === '1' ?
                    targetHobby.querySelector('#hobby-video') :
                    targetHobby.querySelector(`#hobby-video${hobbyNumber}`);

                setTimeout(() => {
                    targetHobby.style.opacity = '1';
                    if (video) {
                        video.currentTime = 0;
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('Video playback failed:', error);
                            });
                        }
                    }
                }, 50);
            }
        });
    });



    // Initialize first view
    showSection(null);
});
