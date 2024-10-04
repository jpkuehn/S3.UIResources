isReadyState(function () {
    // determine what qualifies as an link requiring a speed bump.
    document.querySelectorAll('a').forEach(anchor => {
        if ((enableEmail === true) && anchor.href.startsWith('mailto:')) {
            anchor.classList.add('speedbump');
            return;
        }
        else {
            // provide way to suppress speedbump via class name
            if ((overrideClass !== '') && anchor.classList.contains(overrideClass)) {
                return;
            }

            // is a pdf if ends in '.pdf' or has specified class AND is approved url.
            if ((enablePDF === true) && ((anchor.href.endsWith('.pdf') || anchor.classList.contains(pdfClass) || anchor.parentElement.classList.contains(pdfClass)) && IsApprovedURL(anchor.href))) {
                anchor.classList.add('speedbump');
                return;
            }
            else {
                // is an agreement-type link if has specified class AND is approved url.
                if ((enableAgree === true) && IsApprovedURL(anchor.href) && (anchor.classList.contains(agreeClass) || anchor.parentElement.classList.contains(agreeClass))) {
                    anchor.classList.add('speedbump');
                    return;
                }
                else {
                    if ((enableLink == true) && !IsApprovedURL(anchor.href)) {
                        anchor.classList.add('speedbump');
                    }
                }
            }
        }
    });

    // disable right-click, but exclude mailto links
    if (disableRightClick) {
        document.querySelectorAll('.speedbump:not([href*="mailto"])').forEach(sb => {
            sb.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
        });
    }

    document.querySelectorAll('.speedbump').forEach(sb => {
        sb.addEventListener('click', function (e) {
            e.preventDefault();
            ShowSpeedBumpDialog(this, speedBumpConfig);
            return false;
        });
    });
});

function ShowSpeedBumpDialog(oLink, options) {
    // element that triggered the dialog
    var activeElem = (document.activeElement || document.body);
    var strLink = oLink.href;
    var strTarget = oLink.target;
    var isNoFoward = oLink.classList.contains('no-forward');
    var strClass = oLink.classList;

    if ((strTarget === '') || (strTarget === undefined)) {
        strTarget = '_self';
    }

    if (strClass === undefined) {
        strClass = '';
    }

    // pass in optional callback function as 3rd parameter.
    // don't break exist code that only passes in 2 parameters to ShowSpeedBumpDialog.
    var fnCallback = null;
    if (arguments.length === 3) {
        if (typeof arguments[2] === "function") {
            fnCallback = arguments[2];
        }
    }

    // setup default options
    var config = {
        linkTitle: 'Leave this website?',
        linkMsg: '',
        emailTitle: 'Attention',
        emailMsg: '',
        pdfTitle: 'Attention',
        pdfMsg: '',
        agreeTitle: 'Attention',
        agreeMsg: '',
        customMsgs: [],
        sizeClass: '',
        fadeClass: '',
        bShowLink: false,
        bFormatLink: true,
        backdrop: false,
        okText: 'Ok',
        bShowClose: true,
        closeText: 'Cancel',
        bCloseOnEsc: true,
        bShowTitleBarX: false
    };

    // merge options into config
    for (var key in options) {
        if (Object.hasOwn(options, key)) {
            config[key] = options[key];
        }
    }

    var isMailto = strLink.match(/^mailto:/) ? true : false;

    // parentElement will be null if using OpenExternalLink()
    var isPDF = ((strLink.match(/.pdf$/) || oLink.classList.contains(pdfClass) || ((oLink.parentElement !== null) && oLink.parentElement.classList.contains(pdfClass))) && IsApprovedURL(strLink)) ? true : false;
    var isAgree = ((oLink.classList.contains(agreeClass) || ((oLink.parentElement !== null) && oLink.parentElement.classList.contains(agreeClass))) && IsApprovedURL(strLink)) ? true : false;
    var msg = '';
    var title = '';
    if (isMailto === true) {
        msg = config.emailMsg;
        title = config.emailTitle;
    }
    else {
        if (isPDF === true) {
            msg = config.pdfMsg;
            title = config.pdfTitle;
        }
        else {
            if (isAgree === true) {
                msg = config.agreeMsg;
                title = config.agreeTitle;
            }
            else {
                msg = config.linkMsg;
                title = config.linkTitle;
            }
        }
    }

    // get custom message for link
    if (config.customMsgs !== '') {
        for (var i = 0; i < config.customMsgs.length; i++) {
            if (strLink.toString().indexOf(config.customMsgs[i][0]) !== -1) {
                msg = config.customMsgs[i][1];
            }
        }
    }

    // format message
    var displayedLink = '';
    if (config.bShowLink === true) {
        displayedLink = strLink;

        if (isMailto === true) {
            // remove "mailto:"
            displayedLink = displayedLink.replace(/mailto:/, '');
        }
        else {
            // remove "ftp://", "http://", "https://", etc
            displayedLink = displayedLink.replace(/(\w)*:(\/){2}/, '').replace(/(\/){2}/, '');
        }

        // strip path, querystring and anything else off the end
        if (config.bFormatLink === true) {
            displayedLink = StripUrlEnd(displayedLink, /(\?|\/|#)/);
        }
    }

    msg = msg.replace(/\[link\]/g, displayedLink);

    var speedBumpModal = document.getElementById('speedBumpModal');

    var speedBumpAlreadyExists = false;
    var modalMarkup = '<div class="modal-dialog">' +
        '  <div class="modal-content">' +
        '    <div class="modal-header speedbump-first-focusable-element">' +
        '      <h5 class="modal-title" id="speedBumpModalLabel">' + title + '</h5>' +
        '      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '    </div>' +
        '    <div class="modal-body">' + msg + '</div>' +
        '    <div class="modal-footer">' +
        '      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">' + config.closeText + '</button>' +
        '      <a class="btn btn-primary speedbump-last-focusable-element">' + config.okText + '</a>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    if (speedBumpModal.innerHTML.length > 0) {
        speedBumpAlreadyExists = true;
        speedBumpModal.innerHTML = '';
    }

    speedBumpModal.innerHTML += modalMarkup;

    if (config.fadeClass !== '') {
        speedBumpModal.classList.add(config.fadeClass);
    }
    speedBumpModal.setAttribute('aria-labelledby', 'speedBumpModalLabel');
    if (config.sizeClass !== '') {
        speedBumpModal.querySelector('.modal-dialog').classList.add(config.sizeClass);
    }

    // prevent user from "tabbing off" modal
    var firstElement = speedBumpModal.querySelector('.speedbump-first-focusable-element');
    var lastElement = speedBumpModal.querySelector('.speedbump-last-focusable-element');

    speedBumpModal.addEventListener('keydown', (event) => {
        if (event.target === firstElement && event.key === 'Tab' && event.shiftKey) {
            event.preventDefault();
            lastElement.focus();
        }
        else if (event.target === lastElement && event.key === 'Tab' && !event.shiftKey) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    if (!config.bShowTitleBarX) {
        speedBumpModal.querySelector('.modal-header button.btn-close').style.display = 'none';
    }

    if (!config.bShowClose) {
        speedBumpModal.querySelector('.modal-footer button.btn-secondary').style.display = 'none';
    }

    // "shown.bs.modal" will not fire if modal already exists (swapping out content)
    if (speedBumpAlreadyExists) {
        speedBumpModal.querySelector('.btn-primary').setAttribute('href', strLink);
        if (isMailto !== true) {
            speedBumpModal.querySelector('.btn-primary').setAttribute('target', strTarget);
        }

        // set focus to first selectable element
        var firstSelectableElem = config.bShowTitleBarX ? '.btn-close' : (config.bShowClose ? '.btn-secondary' : '.btn-primary');
        speedBumpModal.querySelector(firstSelectableElem).focus();
    }

    // this will not fire if replacing one speedbump with another
    speedBumpModal.addEventListener('shown.bs.modal', function () {
        // causes issues in FF when using with a button.
        // add class='no-forward' and omit href below if class exists
        if (!isNoFoward) {
            this.querySelector('.btn-primary').setAttribute('href', strLink);
        }
        if (isMailto !== true) {
            this.querySelector('.btn-primary').setAttribute('target', strTarget);
        }

        // set focus to first selectable element
        let firstSelectableElem = config.bShowTitleBarX ? '.btn-close' : (config.bShowClose ? '.btn-secondary' : '.btn-primary');
        this.querySelector(firstSelectableElem).focus();
    });

    speedBumpModal.addEventListener('hide.bs.modal', function () {
        this.removeAttribute('aria-labelledby');

        let md = this.querySelector('.modal-dialog');
        if (md) {
            md.remove();
        }
    });

    speedBumpModal.addEventListener('hidden.bs.modal', function () {
        // restore focus to triggering element
        if (activeElem) {
            if (document.body.contains(activeElem)) {
                let ni = activeElem.closest('.nav-item');
                if (ni) {
                    ni.querySelector('a:first').focus();
                }
                else {
                    activeElem.focus();
                }
                activeElem = null;
            }
        }
    });

    // Bootstrap's modal activation
    var bsSpeedBumpModal = new bootstrap.Modal(speedBumpModal, {
        backdrop: config.backdrop,
        keyboard: config.bCloseOnEsc,
        focus: true
    });

    speedBumpModal.querySelector('.btn-primary').addEventListener('click', function () {
        bsSpeedBumpModal.hide();

        // do callback on primary button click
        if (fnCallback !== null) {
            fnCallback();
        }
    });

    bsSpeedBumpModal.show();
};

function OpenExternalLink(url, target) {
    // pass in optional callback function as 3rd parameter. 
    // don't break exist code that only passes in 2 parameters to OpenExternalLink.
    var fnCallback = null;
    if (arguments.length === 3) {
        if (typeof (arguments[2]) === "function") {
            fnCallback = arguments[2];
        }
    }
    if (IsApprovedURL(url)) {
        if (fnCallback !== null) {
            fnCallback();
        }
        window.open(url, target);
        return false;
    }
    else {
        // create anchor on the fly 
        var oLink = document.createElement('a');
        oLink.href = url;
        oLink.target = target;
        ShowSpeedBumpDialog(oLink, speedBumpConfig, fnCallback);
        return false;
    }
}

function OpenPDF(obj, url, target) {
    if (enablePDF === true) {
        obj.href = url;
        obj.target = target;

        if (!obj.classList.contains(pdfClass)) {
            obj.classList.add(pdfClass);
        }

        if (obj.classList.contains(pdfClass)) {
            ShowSpeedBumpDialog(obj, speedBumpConfig);
        }
    }
    else {
        window.open(url, target);
    }

    // pass in optional callback function as 4th parameter. 
    // don't break exist code that only passes in 3 parameters to OpenExternalLink.
    if (arguments.length === 4) {
        if (typeof (arguments[3]) === "function") {
            arguments[3]();
        }
    }

    return false;
}

function OpenAgree(obj, url, target) {
    if (enableAgree === true) {
        obj.href = url;
        obj.target = target;

        if (!obj.classList.contains(agreeClass)) {
            obj.classList.add(agreeClass);
        }

        if (obj.classList.contains(agreeClass)) {
            ShowSpeedBumpDialog(obj, speedBumpConfig);
        }
    }
    else {
        window.open(url, target);
    }

    // pass in optional callback function as 4th parameter. 
    // don't break exist code that only passes in 3 parameters to OpenExternalLink.
    if (arguments.length === 4) {
        if (typeof (arguments[3]) === "function") {
            arguments[3]();
        }
    }

    return false;
}

function IsApprovedURL(strURL) {
    strURL = strURL.toLowerCase();
    if ((strURL.indexOf('http:') > -1) || (strURL.indexOf('https:') > -1) || (strURL.substring(0, 2) === '//')) {
        if (IsInDomainList(linkApprovedDomains, strURL)) {
            return true;
        }
    }
    else {
        return true;
    }
    return false;
}

function IsInDomainList(strDomainList, strURL) {
    if (strDomainList !== null) {
        var arrDomainList = strDomainList;
        for (var i = 0; i < arrDomainList.length; i++) {
            if (strURL.indexOf(arrDomainList[i]) !== -1) {
                return true;
            }
        }
    }
    return false;
}

function StripUrlEnd(strUrl, re) {
    var index = strUrl.search(re);
    if (index >= 0) {
        return strUrl.substring(0, index);
    }
    return strUrl;
}
