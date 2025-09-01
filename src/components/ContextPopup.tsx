import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export type ContextPopupOption = {
    optionTitle : string;
    icon : string;
    action : (...args : unknown[]) => void;
};

export type ContextPopupProp = {
    anchorRef: React.RefObject<HTMLElement>;
    onClose: () => void;
    options: ContextPopupOption[];
    alignment : 'top' | 'right';
};

type PopupPosition = {
    top : number;
    left : number;
};

export default function ContextPopup( props : ContextPopupProp ) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<PopupPosition>( { top: 0, left: 0} );

    function calculatePopupPosition() {
        let pos : PopupPosition = { top: 0, left: 0 };

        if( props.anchorRef && popupRef && popupRef.current ) {
            const anchorRect = props.anchorRef.current.getBoundingClientRect();
            const popupRect = popupRef.current.getBoundingClientRect();

            const horizontalOffset = 5; // 5 pixels

            if( props.alignment === 'top' ) {
                pos.top = anchorRect.top - popupRect.height;
                pos.left = anchorRect.right - popupRect.width - horizontalOffset;

                if( anchorRect.top - popupRect.height < window.screenTop ) {
                    pos.top = anchorRect.bottom;
                }
            } else if( props.alignment === 'right' ) {
                pos.top = anchorRect.top;
                pos.left = anchorRect.right + horizontalOffset;

                if( anchorRect.top + popupRect.height > window.innerHeight ) {
                    pos.top = window.innerHeight - popupRect.height;
                }
            }

        }
        return pos;
    }


    useEffect(() => {
        setPosition(calculatePopupPosition());

        window.addEventListener("resize", () => props.onClose() );

        return () => {
            window.removeEventListener("resize", () => props.onClose());
        };
    }, [props.anchorRef]);


    return  (

            createPortal(
                    <>
                    <div style={{width: '100%', height: '100%', position: 'fixed', top: '0', left: '0', zIndex: '9998'}} onClick={
                        (e) => {
                            e.stopPropagation();
                            props.onClose();
                             }}></div>
                    <div
                        onClick={(e) => e.stopPropagation() }
                        ref={popupRef}
                        style={
                            {
                                visibility: (popupRef.current) ? 'visible' : 'hidden',
                                position: "fixed",
                                top: position.top,
                                left: position.left,
                                zIndex: 9999,
                                backgroundColor: 'white',
                                border: '1px solid gray',
                                padding: '5px',
                                borderRadius: "4px",
                                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.62)",
                            }
                        }
                    >
                        <ul className="context-popup">
                            {
                                props.options.map( (item, index) => {
                                    return (
                                        <li
                                            style={{display: 'flex', alignItems: 'center', gap: '10px', height: '30px'}}
                                            key={index}
                                            onClick={item.action}
                                        >
                                            {
                                                (item.icon)
                                                    ? <img  width={'20px'} height={'20px'} src={item.icon}></img>
                                                    : <span style={{width: '20px', height: '20px'}}></span>
                                            }
                                            <span>{item.optionTitle}</span>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    </>,
                    document.body
            )

    );
}