$( function( ) {
    'use strict';
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

        contactForm: function( ) {

            $.fn.resetForm = function ( ) {
              $( this ).each (function( ) { this.reset( ); } );
            }

            $('.matoot-form-button').click( function( ){
                var currentForm = $( this ).closest( 'form.matoot-form' );

                var emailElem = currentForm.find( "[name='email']" ).first( );
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

                currentForm.find( ".matoot-form-result" ).removeClass( 'active' ).html( "" );
                if ( !emailReg.test( emailElem.val( ) ) || '' === emailElem.val( ) ) {
                    currentForm.find(".matoot-form-result").addClass('active').html("Invalid Email, please provide a correct email!");
                    emailElem.focus( );
                } else {
                    var data = $( currentForm ).serializeFormJSON( );
                    $.ajax ({
                        url: 'http://api.matoot.com/waitingList',
                        type: "POST",
                        data: JSON.stringify( data ),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function( ){
                            currentForm.find(".matoot-form-result").addClass('active').html( "Congratulations!, you are now on the waiting list." );
                            currentForm.resetForm( );
                        },
                        error: function ( request, status, error ) {
                            currentForm.find(".matoot-form-result").addClass('active').html( request.responseText );
                        }
                    });
                }
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