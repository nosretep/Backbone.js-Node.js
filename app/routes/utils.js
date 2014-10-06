define([ 'jquery', 'models/user', 'models/generic', 'views/layout',
        'views/header', 'views/footer', 'views/generic',
        'json!data/generic.json' ], function($, User, Generic, LayoutView,
        HeaderView, FooterView, GenericView, genericJSON) {

    function handleErrorHtml(req, res, errorCode) {
        var pageDetails = genericJSON['error_' + errorCode];
        var generic = new Generic(pageDetails);
        var genericView = new GenericView({
            'model' : generic
        });
        res.status(errorCode);
        res.render(req.baseHtmlFile, generatePageContentAndTitle(req, genericView));
    }

    function handleErrorJson(req, res, errorCode, errorMessage) {
        res.writeHead(errorCode, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"error" : errorMessage}));
    }

    function getSessionUser(req) {
        var user = new User();
        if (req.session.passport && req.session.passport.user) {
            user = new User(req.session.passport.user);
        }
        return user;
    }

    function generatePageContentAndTitle(req, view) {
        var loggedInUser = getSessionUser(req);
        var layoutView = new LayoutView({'model' : loggedInUser});
            layoutView.render();
        var headerView = new HeaderView({'model' : loggedInUser});
            headerView.render();
        var footerView = new FooterView({'model' : loggedInUser});
            footerView.render();

            layoutView.$el.find('header').append(headerView.$el);
            layoutView.$el.find('footer').append(footerView.$el);
            layoutView.setContent(view);

        return {
            'content' : layoutView.$el.html(),
            'title' : view.getTitle()
        };

    }

    function getJSONFromRequestBody(req) {
        var defer = $.Deferred();
        if (req.body) {
            defer.resolve(req.body);
        } else {
            var dataStr = '';
            req.addListener('data', function(chunk) {
                dataStr += chunk;
            });
            req.addListener('end', function() {
                defer.resolve(JSON.parse(dataStr));
            });
        }
        return defer.promise();
    }

    return {
        handleErrorHtml : handleErrorHtml,
        handleErrorJson : handleErrorJson,
        getSessionUser : getSessionUser,
        generatePageContentAndTitle : generatePageContentAndTitle,
        getJSONFromRequestBody : getJSONFromRequestBody
    };

});