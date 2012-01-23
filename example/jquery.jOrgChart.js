/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Wes Nolte
 * http://twitter.com/wesnolte
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk 
 *
 * This software is licensed under the Creative Commons Attribution-ShareAlike
 * 3.0 License.
 *
 * See here for license terms:
 * http://creativecommons.org/licenses/by-sa/3.0
 */
(function($) {

  $.fn.jOrgChart = function(options) {
    var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
    var $appendTo = $(opts.chartElement);

	// build the tree
    $this = $(this);
    var $container = $("<div class='" + opts.chartClass + "'/>");
    if($this.is("ul")) {
      buildNode($this.find("li:first"), $container, 0, opts);
    }
    else if($this.is("li")) {
      buildNode($this, $container, 0, opts);
    }
    $appendTo.append($container);

	// add drag and drop if enabled
	if(opts.dragAndDrop){
		$('div.node').draggable({
			cursor		: 'move',
			distance	: 40,
			helper      : 'clone',
			opacity		: 0.8,
			revert      : true,
			revertDuration : 100,
			snap		: 'div.node.expanded',
			snapMode	: 'inner',
			stack		: 'div.node'
		});
		
		$('div.node').droppable({
			accept      : '.node',			
			activeClass : 'drag-active',
			hoverClass	: 'drop-hover'
		});
		
	  // Drag start event handler for nodes
	  $('div.node').bind("dragstart", function handleDragStart( event, ui ){
		
		var sourceNode = $(this);
		sourceNode.parentsUntil('.node-container')
				   .find('*')
				   .filter('.node')
				   .droppable('disable');
	  });

	  // Drag stop event handler for nodes
	  $('div.node').bind("dragstop", function handleDragStop( event, ui ){

		/* reload the plugin */
		$(opts.chartElement).children().remove();
		$this.jOrgChart(opts);		
	  });
	
	  // Drop event handler for nodes
	  $('div.node').bind("drop", function handleDropEvent( event, ui ) {	
	    var sourceNode = ui.draggable;
		var targetNode = $(this);
		
		// finding nodes based on plaintext and html
		// content is hard!
		var targetLi = $('li').filter(function(){
			
			li = $(this).clone()
						.children("ul,li")
						.remove()
					.end();
			
			return li.html() == targetNode.html();
		});		
		
		var sourceLi = $('li').filter(function(){
			
			li = $(this).clone()
						.children("ul,li")
						.remove()
					.end();
			
			return li.html() == sourceNode.html();
		});
		
		var sourceliClone = sourceLi.clone();
		var sourceUl = sourceLi.parent('ul');
		
		if(sourceUl.children('li').size() > 1){
			sourceLi.remove();			
		}else{
			sourceUl.remove();
		}
		
		if(targetLi.children('ul').size() >0){
			targetLi.children('ul').append('<li>'+sourceliClone.html()+'</li>');		
		}else{
			targetLi.append('<ul><li>'+sourceliClone.html()+'</li></ul>');					
		}
		
	  }); // handleDropEvent
		
	} // Drag and drop
  };

  // Option defaults
  $.fn.jOrgChart.defaults = {
	chartElement : 'body',
    depth      : -1,
    chartClass : "jOrgChart",
	dragAndDrop: false
  };

  // Method that recursively builds the tree
  function buildNode($node, $appendTo, level, opts) {
	
    var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>");
    var $tbody = $("<tbody/>");

	// Construct the node container(s)
    var $nodeRow = $("<tr/>").addClass("node-cells");
    var $nodeCell = $("<td/>").addClass("node-cell").attr("colspan", 2);
    var $childNodes = $node.children("ul:first").children("li");
    var $nodeDiv;
	
    if($childNodes.length > 1) {
      $nodeCell.attr("colspan", $childNodes.length * 2);
    }
	// Draw the node
	// Get the contents - any markup except li and ul allowed
	var $nodeContent = $node.clone()
							.children("ul,li")
							.remove()
						.end()
						.html();
						
    $nodeDiv = $("<div>").addClass("node").append($nodeContent);

	// Expand and contract nodes
    if ($childNodes.length > 0) {
      $nodeDiv.click(function() {
         var $this = $(this);
         var $tr = $this.closest("tr");
         $tr.nextAll("tr").fadeToggle("fast");

         if($tr.hasClass('contracted')){
           $this.css('cursor','n-resize');
           $tr.removeClass('contracted');
           $tr.addClass('expanded');
         }else{
           $this.css('cursor','s-resize');
           $tr.removeClass('expanded');
           $tr.addClass('contracted');
         }
      });
    }
	
    $nodeCell.append($nodeDiv);
    $nodeRow.append($nodeCell);
    $tbody.append($nodeRow);

    if($childNodes.length > 0) {
	  // if it can be expanded then change the cursor
	  $nodeDiv.css('cursor','n-resize').addClass('expanded');
	
	  // recurse until leaves found (-1) or to the level specified
      if(opts.depth == -1 || (level+1 < opts.depth)) { 
        var $downLineRow = $("<tr/>");
        var $downLineCell = $("<td/>").attr("colspan", $childNodes.length*2);
        $downLineRow.append($downLineCell);
        
		// draw the connecting line from the parent node to the horizontal line 
		$downLine = $("<div></div>").addClass("line down");
		$downLineCell.append($downLine);
        $tbody.append($downLineRow);

        // Draw the horizontal lines
        var $linesRow = $("<tr/>");
        $childNodes.each(function() {
          var $left = $("<td>&nbsp;</td>").addClass("line left top");
          var $right = $("<td>&nbsp;</td>").addClass("line right top");
          $linesRow.append($left).append($right);
        });

		// horizontal line shouldn't extend beyond the first and last child branches
        $linesRow.find("td:first")
					.removeClass("top")
				 .end()
				 .find("td:last")
					.removeClass("top");

        $tbody.append($linesRow);
        var $childNodesRow = $("<tr/>");
        $childNodes.each(function() {
           var $td = $("<td class='node-container'/>");
           $td.attr("colspan", 2);
		   // recurse through children lists and items
           buildNode($(this), $td, level+1, opts);
           $childNodesRow.append($td);
        });

      }
      $tbody.append($childNodesRow);
    }

    // any classes on the LI element get copied to the relevant node in the tree
    // apart from the special 'collapsed' class, which collapses the sub-tree at this point
    if ($node.attr('class') != undefined) {
        var classList = $node.attr('class').split(/\s+/);
        $.each(classList, function(index,item) {
            if (item == 'collapsed') {
                $nodeRow.nextAll('tr').css('display', 'none');
                $nodeRow.removeClass('expanded');
                $nodeRow.addClass('contracted');
                $nodeDiv.css('cursor','s-resize');
            } else {
                $nodeDiv.addClass(item);
            }
        });
    }

    $table.append($tbody);
    $appendTo.append($table);
  };

})(jQuery);
