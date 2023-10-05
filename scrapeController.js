const scrapers = require('./scraper')
const fs = require('fs')

const scrapeController = async (browserInstance) => {
    const url = 'https://digital-world-2.myshopify.com/'
    try {
        let browser = await browserInstance
        // gọi hàm cạo ở file s scrape
        const categories = await scrapers.scrapeCategory(browser, url)

        const catePromise = [];
        for (let i of categories) catePromise.push(scrapers.scrapeItems(browser, i.link));
        const itemAllCate = await Promise.all(catePromise);
        const prodPromise = [];
        for (let i of itemAllCate) {
            for (let j of i) prodPromise.push(await scrapers.scraper(browser,j))
        }
        const rs = await Promise.all(prodPromise);
        fs.writeFile('ecommerce.json', JSON.stringify(rs), (err) => {
            if (err) console.log('Ghi data vô file json thất bại: ' + err)
            console.log('Thêm data thanh công !.')
        })

        // const selectedCategories = categories[0];
        // const items = await scrapers.scrapeItems(browser, selectedCategories.link)
        // const item = items[0]
        // const rs = await scrapers.scraper(browser, item)
        // fs.writeFile('ecommerce.json', JSON.stringify(rs), (err) => {
        //     if (err) console.log('Ghi data vô file json thất bại: ' + err)
        //     console.log('Thêm data thanh công !.')
        // })

        // categories.forEach(async (category) => {
        //     // console.log('category', category);
        //     const items = await scrapers.scrapeItems(browser, category.link)
        //     // console.log('items',items);
        //     items.forEach(async (item) => {
        //         const rs = await scrapers.scraper(browser, item)
        //         fs.writeFile('ecommerce.json', JSON.stringify({ [category]: rs }), (err) => {
        //             if (err) console.log('Ghi data vô file json thất bại: ' + err)
        //             console.log('Thêm data thanh công !.')
        //         })
        //     })
        // })
        await browser.close()
    } catch (e) {
        console.log('Lỗi ở scrape controller: ' + e);
    }
}

module.exports = scrapeController