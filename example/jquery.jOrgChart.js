/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Wes Nolte
 * http://twitter.com/wesnolte
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk 
 *
 * Copyright (c) 2011 Wesley Nolte
 * Dual licensed under the MIT and GPL licenses.
 *
 */
(function($) {

  $.fn.jOrgChart = function(options) {
    var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
    var $appendTo = $(opts.chartElement);
    var callbackFunction = opts.cb;
    if (typeof callbackFunction != 'function') {
        callbackFunction = $.noop;
    }

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

    // add highlight event if enabled
    if(opts.highlightParent){
        $('div.node').hover(function(){
            var $this = $(this),
                $nodec = $this.closest('.node-container'),
                ix = $nodec.index(),
                start = ix;
                count = $nodec.parent().children().length,
                $tr = $nodec.closest('tr'),
                lvl = $tr.index(),
                $linkup = $tr.siblings().eq(lvl-2),
                $linkover = $tr.siblings().eq(lvl-1);

            if (ix > count / 2 || (!(count%2) && ix == count/2)) {
                $linkover.children().slice(count,2*ix+1).addClass('top-hl');
            } else if (ix < count / 2 && !(count%2 && ix == (count-1)/2)) {
                $linkover.children().slice(2*ix+1, count+1).addClass('top-hl');
            }
            $linkover.children().eq(2*ix+1).addClass('right-hl');
            $linkover.children().eq(2*ix).addClass('left-hl');
            $('.line.down', $linkup).addClass('highlighted');
        }, function(){
            var $this = $(this),
                $nodec = $this.closest('.node-container'),
                $table = $nodec.closest('table');
            $('.highlighted', $table).removeClass('highlighted');
            $('.top-hl', $table).removeClass('top-hl');
            $('.left-hl', $table).removeClass('left-hl');
            $('.right-hl', $table).removeClass('right-hl');
        });
    }
    // add drag and drop if enabled
    if(opts.dragAndDrop){
        $('div.node').draggable({
            cursor      : 'move',
            distance    : 40,
            helper      : 'clone',
            opacity     : 0.8,
            revert      : true,
            revertDuration : 100,
            snap        : 'div.node.expanded',
            snapMode    : 'inner',
            stack       : 'div.node'
        });
        
        $('div.node').droppable({
            accept      : '.node',          
            activeClass : 'drag-active',
            hoverClass  : 'drop-hover'
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
                    var attr = li.attr('id');
                    if (typeof attr !== 'undefined' && attr !== false) {
                        return li.attr("id") == targetNode.attr("id");
                    }
                    else {
                        return li.html() == targetNode.html();
                    }
            
        });     
        
        var sourceLi = $('li').filter(function(){
            
            li = $(this).clone()
                        .children("ul,li")
                        .remove()
                    .end();
                    var attr = li.attr('id');
                    if (typeof attr !== 'undefined' && attr !== false) {
                        return li.attr("id") == sourceNode.attr("id");
                    }
                    else {
                        return li.html() == sourceNode.html();
                    }
            
        });
        
        var sourceliClone = sourceLi.clone();
        var sourceUl = sourceLi.parent('ul');
        
        if(sourceUl.children('li').size() > 1){
            sourceLi.remove();          
        }else{
            sourceUl.remove();
        }
        
        var id = sourceLi.attr("id");

        if(targetLi.children('ul').size() >0){
            if (typeof id !== 'undefined' && id !== false) {
                targetLi.children('ul').append('<li id="'+id+'">'+sourceliClone.html()+'</li>');
            }else{
                targetLi.children('ul').append('<li>'+sourceliClone.html()+'</li>');        
            }
        }else{
            if (typeof id !== 'undefined' && id !== false) {
                targetLi.append('<ul><li id="'+id+'">'+sourceliClone.html()+'</li></ul>');
            }else{
                targetLi.append('<ul><li>'+sourceliClone.html()+'</li></ul>');                  
            }
        }
        
      }); // handleDropEvent
        
    } // Drag and drop
  };

  // Option defaults
  $.fn.jOrgChart.defaults = {
    chartElement : 'body',
    depth      : -1,
    chartClass : "jOrgChart",
    dragAndDrop: false,
    highlightParent : false
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
    
    var callbackFunction = opts.cb;
    if (typeof callbackFunction != 'function') {
        callbackFunction = $.noop;
    }

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
                        
    var new_node_id = $node.attr("id");
    if (typeof new_node_id !== 'undefined' && new_node_id !== false) {
        $nodeDiv = $("<div>").addClass("node").attr("id", $node.attr("id")).append($nodeContent);
    }else{
        $nodeDiv = $("<div>").addClass("node").append($nodeContent);
    }

    // Expand and contract nodes
    if ($childNodes.length > 0 && opts.collapse !== false) {
      $nodeDiv.click(function() {
          var $this = $(this);
          var $tr = $this.closest("tr");

          if($tr.hasClass('contracted')){
            $this.css('cursor','n-resize');
            $tr.removeClass('contracted').addClass('expanded');
            $tr.nextAll("tr").css('visibility', '');
          }else{
            $this.css('cursor','s-resize');
            $tr.removeClass('expanded').addClass('contracted');
            $tr.nextAll("tr").css('visibility', 'hidden');
          }
        });
    }
    
    $nodeCell.append($nodeDiv);
    $nodeRow.append($nodeCell);
    $tbody.append($nodeRow);

    if($childNodes.length > 0) {
      if (opts.collapse !== false) {
        // if it can be expanded then change the cursor
        $nodeDiv.css('cursor','n-resize').addClass('expanded');
      }
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
    
    /* Prevent trees collapsing if a link, button, or input inside a node is clicked */
    $nodeDiv.children('a, button, input').click(function(e){
        console.log(e);
        e.stopPropagation();
    });

    callbackFunction($nodeDiv);
  };

})(jQuery);
