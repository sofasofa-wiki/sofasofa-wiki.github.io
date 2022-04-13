class ZamaDoc {
    constructor() {
        this.isLeftMenuOpen = false;
        this.isScrollspyOpen = false;

        this.initGsap();
        this.initCode();
        this.appendMainMenuItemsForMobile();
        this.attachEvents();
    }

    getGsap() {
        return new Promise((res) => {
            if (window.gsap) {
                return res(window.gsap);
            }

            this.initGsap((_gsap) => {
                res(_gsap);
            });
        });
    }

    initGsap (onload) {    
        if (window.innerWidth <= 1050 || onload) {
            const link = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js';
            const script = document.createElement('script');
            script.src = link;
            script.onload = () => {
                if (onload) {
                    onload(window.gsap);
                }
            }
        
            document.body.append(script);
        }
    }

    initCode() {
        const code = $('pre > code');
    
        if (!!code.length) {
            const script = document.createElement('script');
            const link = document.createElement('link');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js';
            link.href = 'https://highlightjs.org/static/demo/styles/night-owl.css';
            link.rel = 'stylesheet';
    
            script.onload = () => {
                code.each(function(i, e) { hljs.highlightBlock(e); });
            };
            
            document.body.append(link);
            document.body.append(script);
        }
    }

    async leftMenuOpenHandler () {
        const gsap = await this.getGsap();
        gsap.to('main', {duration: 0.5, x: 320});
        gsap.to('aside', {duration: 0.5, x: 320});
        gsap.to('header', {duration: 0.5, x: 320});
        this.isLeftMenuOpen = true;
    }

    async leftMenuCloseHandler() {
        const gsap = await this.getGsap();
        gsap.to('main', {duration: 0.5, x: 0});
        gsap.to('aside', {duration: 0.5, x: 0});
        gsap.to('header', {duration: 0.5, x: 0});
        this.isLeftMenuOpen = false;
    }

    async scrollspyOpenHandler() {
        const gsap = await this.getGsap();
        gsap.to('.scrollspy', {duration: 0.5, x: -260});
        gsap.to('.menu-btn-scrollspy', {duration: 0.5, x: -260});
        this.isScrollspyOpen = true;
    }

    async scrollspyCloseHandler() {
        const gsap = await this.getGsap();
        gsap.to('.scrollspy', {duration: 0.5, x: 0});
        gsap.to('.menu-btn-scrollspy', {duration: 0.5, x: 0});
        this.isScrollspyOpen = false;
    }

    appendMainMenuItemsForMobile() {
        const links = $('header .links a')
            .toArray()
            .map(e => `<li><a href="${$(e).attr('href')}">${$(e).text()}</a></li>`);

        $('.main-menu-items').html(links);
    }

    attachEvents() {
        $('.btn-left-menu').click(() => {
            if (this.isLeftMenuOpen) {
                this.leftMenuCloseHandler();
            } else {
                this.leftMenuOpenHandler();
            }
        });
    
        $('.menu-btn-scrollspy').click(() => {
            if (this.isScrollspyOpen) {
                this.scrollspyCloseHandler();
            } else {
                this.scrollspyOpenHandler();
            }
        });

        $('.search input.uk-search-input').on('input', async function() {
            const value = $(this).val().toLowerCase();
            if (!value) return $('.search-result').hide();
            $('.search-result a').hide();
            const items = $('.search-result a').toArray().filter(e => $(e).find('strong').text().toLowerCase().includes(value) || $(e).find('span').text().toLowerCase().includes(value) );
            if (items.length) {
                $(items).show();
                $('.search-result').show();
            } else {
                $('.search-result').hide()
            }
        });
    }
}

new ZamaDoc();