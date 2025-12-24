import styles from './FeedListItem.module.css';

export type FeedListItemPlaceholderProp = {
    id                      : number;
    title                   : string;
    isSelected              : boolean;
    favicon                 : string;
    isRead                  : boolean;
    commentsActiveId        : number;
    commentsUrl             ?: string;
};

export default function FeedListItemPlaceholder( props : FeedListItemPlaceholderProp ) {
    return (
        <div
            tabIndex={0}
            className={`${styles['feed-item']} ${props.isSelected ? styles.selected : ''} ${props.isRead ? styles.read : ''}`}
        >
            {
                (props.favicon)
                    ?   <img
                            className={styles["feed-item-favicon"]}
                            src={props.favicon}
                        ></img>
                    : ''
            }
            <div className={styles["feed-item-title"]}>{props.title}</div>


            <div className={`${styles['feed-item-options-container']}`}>
                 {
                    (props.commentsUrl)
                        ?
                        <div className={`${styles['feed-item-options-container']} ${props.commentsActiveId === props.id ? styles.selected : ''}`}>
                            <div className={styles['feed-item-option']}>
                                <img src={'../icons/comments.svg'}></img>
                            </div>
                        </div>
                        : <></>
                }

                <div className={`${styles[`feed-item-options-container`]}`}>
                    <div className={styles[`feed-item-option`]}>
                        <img
                            src={
                                (props.isRead)
                                    ? '../icons/check_disabled.svg'
                                    : '../icons/check.svg'
                            }
                        ></img>
                    </div>
                </div>

                <div className={`${styles['feed-item-options-container']}`}>

                    <div className={styles['feed-item-option']}>
                        <img src={'../icons/v_dots.svg'}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}