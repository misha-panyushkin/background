***Backgrounds.***
	
	
> Browsers are smart! So, why can't we try to use the best of them?

**Title:** Operating with image DOM backgrounds via CSS rules.

**Aim:** Simple solution. Modern browsers support. Mobile oriented.

**Results:**

`Background(url [, element]);`

For example:
	
	// Applying landscape ratio image to the document element.
	var city = Background(
		"http://maltasegwaytours.com/site/wp-content/uploads/2013/06/Malta.jpg"
	);

	// Check the methods out.
	city.pave();
	city.scratch();
	city.alwaysFill();
	city.alwaysCenter();
	city.alwaysFillAndCenter();
	city.clean();

	// Could try with portrait ratio image:
	"http://www.concordetravel.ie/wp-content/gallery/malta-gozo-amp-comino-intro/malta-blue-grotto.jpg"

	// or with square ratio one:
	"http://farm6.staticflickr.com/5465/6927243032_946c2bd7c8_o.jpg"
	


**Technologies used in particular project:**

1. [Promises/A+](http://promises-aplus.github.io/promises-spec/ "specification")
2. [Media Queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries "specification")