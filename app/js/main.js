$( function( ) {
    'use strict';
    
    var color = {gray:0};
    var image = $("#wanted-monkey")[0];
    
    
    TweenMax.to(color, 2, {gray:1, onUpdate:applyColor, onUpdateParams:[image], repeat:50, yoyo:true, repeatDelay:0.2})
    
    function applyColor(element) {
        //apply filter yourself
        element.style["-webkit-filter"] = "grayscale(" + color.gray + ")"
    }

    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
    var videoSeen = false;

    var Main = {

        init: function( ) {
            //Contact Form
            this.contactForm( );
        },

        sendPost: function ( object ) {
            console.log( 'entro' );
            var currentForm = $( object ).closest( 'form.matoot-form' );

            var emailElem = currentForm.find( "[name='email']" ).first( );
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

            currentForm.find( ".matoot-form-result" ).removeClass( 'active' ).html( "" );
            if ( !emailReg.test( emailElem.val( ) ) || '' === emailElem.val( ) ) {
                currentForm.find(".matoot-form-result").addClass('active').html("Invalid Email, please provide a correct email!");
                emailElem.focus( );
            } else {
                var data = $( currentForm ).serializeFormJSON( );
                $.ajax ({
                    url: 'http://api.matoot.com/newWaitingList',
                    type: "POST",
                    data: JSON.stringify( data ),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function( ){
                        currentForm.find( '.matoot-form-result' ).addClass( 'active' ).html( "Congratulations!, you are now on the waiting list." );
                        currentForm.resetForm( );
                    },
                    error: function ( request, status, error ) {
                        currentForm.find( ".matoot-form-result" ).addClass( 'active' ).html( request.responseJSON.msg );
                    }
                });
            }
        },

        contactForm: function( ) {

            $.fn.resetForm = function ( ) {
              $( this ).each (function( ) { this.reset( ); } );
            }

            $( '#email_input' ).keypress( function ( e ) {
              if ( e.which == 13 ) {
                Main.sendPost( this );
                return false;    //<---- Add this line
              }
            });

            $( '.matoot-form-button' ).click( function( ){
                Main.sendPost( this );
                return false;
            });

        }

    };

    var isMobile = {
        Android: function( ) {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function( ) {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function( ) {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function( ) {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function( ) {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function( ) {
            return (isMobile.Android( ) || isMobile.BlackBerry( ) || isMobile.iOS( ) || isMobile.Opera( ) || isMobile.Windows( ));
        }
    };

    Main.init( );
/*

    $( window ).afterResize( function( ) {
        console.log('entro');
    } );
*/

    $( document ).ready( function( ) {
        var navHeight = $( '.navbar' ).height( );
        $('#intro-container').css( 'margin-top', navHeight );


        $( '#modal-autofocus' ).focus( );
		// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
		if (!String.prototype.trim) {
			(function() {
				// Make sure we trim BOM and NBSP
				var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
				String.prototype.trim = function() {
					return this.replace(rtrim, '');
				};
			})();
		}

		[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
			// in case the input is already filled..
			if( inputEl.value.trim() !== '' ) {
				classie.add( inputEl.parentNode, 'input--filled' );
			}

			// events:
			inputEl.addEventListener( 'focus', onInputFocus );
			inputEl.addEventListener( 'blur', onInputBlur );
		} );

		function onInputFocus( ev ) {
			classie.add( ev.target.parentNode, 'input--filled' );
		}

		function onInputBlur( ev ) {
			if( ev.target.value.trim() === '' ) {
				classie.remove( ev.target.parentNode, 'input--filled' );
			}
		}
    } );
} );