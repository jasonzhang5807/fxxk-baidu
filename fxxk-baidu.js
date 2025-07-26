// ==UserScript==
// @name         fxxk baidu
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  精准屏蔽带有广告标记的div，不影响正常搜索结果
// @author       jasonzhang5807
// @match        *://www.baidu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽广告的函数
    function blockAds() {
        // 查找所有可能的广告容器
        const adContainers = document.querySelectorAll('div.c-container, div._3rqxpq2, div.EC_result, div.new-pmd');

        adContainers.forEach(container => {
            // 检查容器内是否有广告标记
            const adSpans = container.querySelectorAll('span.ec-tuiguang, span.m12mvnb, span[data-tuiguang]');

            if (adSpans.length > 0) {
                // 找到广告标记，屏蔽整个容器
                container.style.display = 'none';
                console.log('fucked:', container);
            } else {
                // 没有广告标记，检查其他广告特征
                const isAd = container.getAttribute('data-tuiguang') ||
                             container.querySelector('[data-tuiguang]') ||
                             container.textContent.includes('广告') ||
                             container.textContent.includes('推广');

                if (isAd) {
                    container.style.display = 'none';
                    console.log('fucked(通过其他特征):', container);
                }
            }
        });
    }

    // 初始执行
    blockAds();

    // 监听DOM变化，处理动态加载的广告
    const observer = new MutationObserver(function(mutations) {
        let needsCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                needsCheck = true;
            }
        });
        if (needsCheck) {
            blockAds();
        }
    });

    // 开始观察整个body的子节点变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加样式，使屏蔽更彻底
    const style = document.createElement('style');
    style.innerHTML = `
        /* 屏蔽带有广告标记的容器 */
        div.c-container span.ec-tuiguang,
        div.c-container span.m12mvnb,
        div._3rqxpq2 span.ec-tuiguang,
        div._3rqxpq2 span.m12mvnb,
        div.EC_result span.ec-tuiguang,
        div.EC_result span.m12mvnb,
        div.new-pmd span.ec-tuiguang,
        div.new-pmd span.m12mvnb {
            display: none !important;
        }

        /* 屏蔽整个广告容器 */
        div.c-container[data-tuiguang],
        div._3rqxpq2[data-tuiguang],
        div.EC_result[data-tuiguang],
        div.new-pmd[data-tuiguang] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
