/*
 * Background manager
 *
 * Copyright by Misha Panyushkin
 * Github repo: https://github.com/misha-panyushkin/every_day
 * Follow: https://github.com/misha-panyushkin
 * */

// Needed addons.
 (function () {
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var args = Array.prototype.slice.call(arguments, 1);
        var func = this;
        return function () {
            var add_args = Array.prototype.slice.call(arguments);
            return func.apply(context, args.concat(add_args));
        }
    }
 })();

(function (w, $) {

    "use strict";

    var document = w.document;

    var Background = function (url, elem) {

        var defer = $.Deferred();

        this.__$frame = $((elem instanceof w.HTMLDocument || elem instanceof w.HTMLElement) ? elem : document.documentElement);

        this.__$frame.css({
            width: "100%",
            height: "100%"
        });

        this.__$image  = $("<img/>").attr("src", url);

        if (this.__$image.get(0).complete) {
            defer.resolve(this.__$image.get(0));
        } else {
            this.__$image.get(0).onload = function (event) {
                defer.resolve(this, event);
            };
        }

        this.__promise = defer.promise();

        this.__couple = ["auto", "auto"];

        this.__matchSwitch = function (aspect) {
            console.log("matchSwitch");
            if (aspect.matches) {
                this.__$frame.css("backgroundSize", this.__couple.slice(0).reverse().join(" ") );
            } else {
                this.__$frame.css("backgroundSize", this.__couple.join(" "));
            }
        }.bind(this);

        this.__centerMatchSwitch = function (aspect) {
            console.log("centerMatchSwitch");
            if (aspect.matches) {
                this.__couple = ["auto", "auto"];
                if (this.__ratio >= 1) {
                    this.__couple[0] = "100%";
                } else {
                    this.__couple[1] = "100%";
                }
                this.__matchSwitch(this.__aspect);
            } else {
                this.__couple = ["", ""];
                this.__$frame.css("backgroundSize", "");
            }
        }.bind(this);
    };

    Background.prototype = {

        pave: function () {
            this.clean();
            this.__promise.done(function (img) {
                this.__$frame.css({
                    backgroundImage:    "url('" + img.src + "')",
                    backgroundRepeat:   "repeat",
                    backgroundPosition: "left top",
                    backgroundSize:     "auto"
                });
            }.bind(this));

            return this;
        },

        scratch: function () {
            this.clean();
            this.__promise.done(function (img) {
                this.__$frame.css({
                    backgroundImage:    "url('" + img.src + "')",
                    backgroundRepeat:   "no-repeat",
                    backgroundPosition: "left top",
                    backgroundSize:     "100% auto"
                });
            }.bind(this));

            return this;
        },

        alwaysFill: function () {
            this.clean();
            this.__promise.done(function (img) {
                this.__$frame.css("backgroundPosition", "left top");                

                this.__$frame.css({
                    backgroundImage:    "url('" + img.src + "')",
                    backgroundRepeat:   "no-repeat"
                });

                this.__ratio  = img.width/img.height;

                this.__aspect = w.matchMedia("(" + (this.__ratio >= 1 ? "min" : "max") + "-aspect-ratio:" + img.width + "/" + img.height + ")");

                if (this.__ratio < 1) {
                    this.__couple[0] = "100%";
                } else {
                    this.__couple[1] = "100%";
                }

                this.__matchSwitch(this.__aspect);
                this.__aspect.addListener(this.__matchSwitch);
            }.bind(this));

            return this;
        },

        alwaysCenter: function () {
            this.clean();
            this.__promise.done(function (img) {
                this.__$frame.css("backgroundPosition", "50% 50%");

                this.__$frame.css({
                    backgroundImage:    "url('" + img.src + "')",
                    backgroundRepeat:   "no-repeat"
                });

                this.__ratio  = img.width/img.height;

                this.__aspect = w.matchMedia("(" + (this.__ratio >= 1 ? "min" : "max") + "-aspect-ratio:" + img.width + "/" + img.height + ")");

                if (this.__ratio >= 1) {
                    this.__couple[0] = "100%";
                } else {
                    this.__couple[1] = "100%";
                }

                this.__outside_aspect = w.matchMedia("(max-width:" + img.width + "px) and (max-height:" + img.height + "px) , (max-width:" + img.width + "px) , (max-height:" + img.height + "px)");
                this.__centerMatchSwitch(this.__outside_aspect);
                this.__outside_aspect.addListener(this.__centerMatchSwitch);

                this.__matchSwitch(this.__aspect);
                this.__aspect.addListener(this.__matchSwitch);
            }.bind(this));

            return this;
        },

        alwaysFillAndCenter: function () {
            this.clean();
            this.__promise.done(function (img) {
                
                this.__onResize = function (img, event) {
                    var left = (img.width/2 - w.innerWidth/2)/img.width*100;
                    var top = (img.height/2 - w.innerHeight/2)/img.height*100;
                    this.__$frame.css("backgroundPosition", left + "% " + top + "%");
                }.bind(this, img);
                this.__onResize();

                w.addEventListener("resize", this.__onResize);

                this.__$frame.css({
                    backgroundImage:    "url('" + img.src + "')",
                    backgroundRepeat:   "no-repeat"
                });

                this.__ratio  = img.width/img.height;

                this.__aspect = w.matchMedia("(" + (this.__ratio >= 1 ? "min" : "max") + "-aspect-ratio:" + img.width + "/" + img.height + ")");

                if (this.__ratio < 1) {
                    this.__couple[0] = "100%";
                } else {
                    this.__couple[1] = "100%";
                }

                this.__matchSwitch(this.__aspect);
                this.__aspect.addListener(this.__matchSwitch);
            }.bind(this));

            return this;
        },

        clean: function () {
            this.__$frame.css({
                backgroundImage:    "",
                backgroundRepeat:   "",
                backgroundPosition: "",
                backgroundSize:     ""
            });

            this.__couple = ["auto", "auto"];
            this.__aspect && this.__aspect.removeListener(this.__matchSwitch);
            this.__outside_aspect && this.__outside_aspect.removeListener(this.__centerMatchSwitch);
            this.__onResize && w.removeEventListener("resize", this.__onResize);

            return this;
        }
    };

    w.Background = function (url, node) {
        return new Background(url, node);
    };

}) (this, jQuery);