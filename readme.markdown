#Readme


##Overview

Follow me [@wesnolte](http://twitter.com/wesnolte)

jQuery OrgChart is a plugin that allows you to render structures with nested elements in a easy-to-read tree structure. To build the tree all you need is to make a single line call to the plugin and supply the HTML element Id for a nested unordered list element that is representative of the data you'd like to display. If drag-and-drop is enabled you'll be able to reorder the tree which will also change the underlying list structure. 

Features include:

* Very easy to use given a nested unordered list element.
* Drag-and-drop functionality allows reordering of the tree and underlying `<ul>` structure.
* Showing/hiding a particular branch of the tree by clicking on the respective node.
* Nodes can contain any amount of HTML except `<li>` and `<ul>`.
* Easy to style.
* You can specify that sub-trees should start collapsed, which is useful for very large trees

![jQuery OrgChart](http://i.imgur.com/T8kKA.png "jQuery OrgChart")

----

##Expected Markup & Example Usage

To get up and running you'll need a few things. 

-----

###The JavaScript Libraries & CSS

You need to include the jQuery as well as the jOrgChart libraries. For example:

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
	<script type="text/javascript" src="jquery.jOrgChart.js"></script>
	
If you want to use the drag-and-drop functionality you'll need to include jQuery UI too:

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>
	
The core CSS is necessary to perform some of the basic styling i.e.

    <link rel="stylesheet" href="css/jquery.jOrgChart.css"/>

----

###The HTML

You'll need to construct a nest unordered list that represents your node nesting. For example:

	<ul id="org" style="display:none">
	<li>
	  Food
	  <ul>
	    <li>Beer</li>
	    <li>Vegetables
	      <ul>
	        <li>Pumpkin</li>
	        <li><a href="http://tquila.com" target="_blank">Aubergine</a></li>
	      </ul>
	    </li>
	    <li>Bread</li>
	    <li>Chocolate
	      <ul>
	        <li>Topdeck</li>
	        <li>Reese's Cups</li>
	      </ul>
	    </li>
	  </ul>
	</li>
	</ul>

If you want a sub-tree to start off hidden, just add `class="collapsed"` to a list item (`<li>`). That list item will appear, but everything below it won't. For example:

	<ul id="org" style="display:none">
      <li>Food:
        <ul>
          <li>Beer</li>
          <li class=collapsed>Vegetables
            <ul>
              <li>Carrot</li>
              <li>Pea</li>
            </ul>
          </li>
          <li>Chocolate</li>
        </ul>
      </li>
    </ul>

This plugin works by generating the tree as a series of nested tables. Each node in the tree is represented with `<div class="node">`. You can include any amount of HTML markup in your `<li>` **except** for other `<ul>` or `<li>` elements. Your markup will be used within the node's `<div>` element. Any classes you attach to the `<li>` elements will be copied to the associated node, allowing you to highlight particular parts of the tree. The special `collapsed` class described above doesn't get copied to the node.


-----

###The jQuery Call

And the cherry on the top is the usual call, often but not always on document load. You'll need to specify the Id of the list in this call. For example:

	jQuery(document).ready(function() {
	    $("#org").jOrgChart();
	});
	
This call will append the markup for the OrgChart to the `<body>` element by default, but you can specify this as part of the options.

----

##Demo

You can view a demo of this [here](http://bit.ly/u1XhTf "jQuery OrgChart").

------

##Sourcecode

Source code with an example is available [here](https://github.com/wesnolte/jOrgChart/tree/master/example "Example & Source").

-----

##Configuration

There are only 3 configuration options:

1. **chartElement** - used to specify which HTML element you'd like to append the OrgChart markup to. *[default='body']*
2. **depth** - tells the code what depth to parse to. The default value of "-1" instructs it to parse like it's 1999. *[default=-1]*
3. **chartClass** - the name of the style class that is assigned to the generated markup. *[default='jOrgChart']*
4. **dragAndDrop** - determines whether the drag-and-drop feature of tree node elements is enabled. *[default=false]*
