class page {
    async constructor() {
        await this.initPageData();
        await this.initSearchData();
        await this.convertImgToLightbox();
        await this.attachEvents();
    }

    async initSearchData () {
        if (this.isSearchDataLoaded) return false;

        const { pageOptions = {} } = window;
        const { searchDataPath = '' } = pageOptions;

        if (!searchDataPath) return false;

        const data = await fetch(searchDataPath);
        window.searchData = await data.json();

        this.isSearchDataLoaded = true;
        return true;
    };

    initPageData() {
        const { pageHeadings = {} } = window;

        const headingHtml = pageHeadings.map(({ id, title, type }) => `
            <li class="spy-item">
            <a href="#${id}" ${type === 'H3' ? 'style="padding-left:35px;"' : ''}>${type === 'H3' ? '→ ':''}${title}</a>
            </li>
        `).join('');
    
        $('.scrollspy .uk-nav').prepend(headingHtml);

        $(`a[data-page-id=${pageOptions.pageId}]`)
            .parent('li')
            .addClass('uk-active');
    
        $('.uk-nav .uk-active')
            .parents('.uk-parent')
            .addClass('uk-open')
            .find('ul')
            .attr('hidden', false);
        
        $('main .button').hide();
    
        const setButton = ({ button, text, link }) => {
            $(`.buttons a.button-${button}`).attr('href', link);
            $(`.buttons a.button-${button} h3`).text(text);
            $(`.buttons a.button-${button}`).show();
        }
    
        if ($('aside .uk-active').next().length) {
            const next = $('aside .uk-active').next().find('a')[0];
            if ($(next).attr('href') && $(next).attr('href') !== '#') {
                setButton({ button: 'right', link: $(next).attr('href'), text: $(next).text() });
            }
        } else if ($('aside .uk-active').parents('li').next().length && $('aside .uk-active').parents('li').next().find('li a').length) {
            const next = $('aside .uk-active').parents('li').next().find('li a')[0];
            if ($(next).attr('href') && $(next).attr('href') !== '#') {
                setButton({ button: 'right', link: $(next).attr('href'), text: $(next).text() });
            }
        }
    
        if ($('aside .uk-active').prev().length) {
            const prev = $('aside .uk-active').prev().find('a');
            if ($(prev).attr('href') && $(prev).attr('href') !== '#') {
                setButton({ button: 'left', link: $(prev).attr('href'), text: $(prev).text() });
            }
        } else if ($('aside .uk-active').parents('li').prev().length && $('aside .uk-active').parents('li').prev().find('li a').length) {
            let prev = $('aside .uk-active').parents('li').prev().find('li a');
            prev = prev[prev.length - 1];
            if ($(prev).attr('href') && $(prev).attr('href') !== '#') {
                setButton({ button: 'left', link: $(prev).attr('href'), text: $(prev).text() });
            }
        }
    }

    convertImgToLightbox() {
        $('main img').each((i, e) => (
            $(e).wrap(`
                <div uk-lightbox>
                    <a href="${$(e).attr('src')}"></a>
                </div>
            `)
        ));
    
        $('h1, h2, h3').each((i, e) => (
            $(e).html(`<a href="#${$(e).attr('id')}">${$(e).html()}</a>`)
        ));
    };

    attachEvents() {
        $('.search input.uk-search-input').on('input', async function() {
            if (!this.isSearchDataLoaded) {
                await this.initSearchData();
            }
        
            const value = $(this).val().toLowerCase();
        
            if (!value || value.length < 3) return $('.search-result').hide();
        
            const filteredData = window.searchData.filter(({ title = '', pageTitle = '', parentId = '', pageId = '' }) => {
                if (title && title.toLowerCase().indexOf(value) > -1) {
                    return true;
                }
        
                if (pageTitle && pageTitle.toLowerCase().indexOf(value) > -1) {
                    return true;
                }
        
                if (parentId && parentId.toLowerCase().indexOf(value) > -1) {
                    return true;
                }
    
                if (pageId && pageId.toLowerCase().indexOf(value) > -1) {
                    return true;
                }
            });
        
            if (filteredData.length) {
                const searchItemsHtml = filteredData.map(({title, pageTitle, pagePath, id}) => (`
                    <a href="${pagePath}#${id}">
                    <strong>${pageTitle}</strong><br />
                    <span>${title}</span>
                    </a>
                `
                )).join('');
                $('.search-result div').html(searchItemsHtml)
                $('.search-result').show();
            } else {
                $('.search-result').hide();
            }
        });
    }
}

new Page();
