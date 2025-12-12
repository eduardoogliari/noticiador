import { useRef } from "react";
import ContextPopup, {ContextPopupOption} from "./ContextPopup";
import styles from './FeedListItem.module.css';
import { useTranslation } from "react-i18next";

export type FeedListItemProp = {
    id                      : number;
    url                     : string;
    commentsUrl            ?: string;
    summary                ?: string;
    title                   : string;
    subName : string;
    onClick                 : (itemId : number, url : string) => void;
    setIsFeedFavorite       : (itemId : number, value : boolean) => void;
    deleteFeedItems         : (itemIds : number[]) => void;
    onMoreOptionsClick      : (itemId : number, url : string, event: React.MouseEvent) => void;
    onMarkReadClick         : (itemId : number, event: React.MouseEvent) => void;
    onCommentsClick         : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    onMouseOverFeedItem     : (url : string) => void;
    openInExternalBrowser   : (url : string) => void;
    copyToClipboard         : (url : string) => void;
    setInFeedBin            : (itemIds: number[], value : boolean) => void;
    onCloseFeedOptionsPopup : () => void;
    isSelected              : boolean;
    commentsActiveId        : number;
    moreOptionsActiveId     : number;
    favicon                 : string;
    isFavorite              : boolean;
    isRead                  : boolean;
    inFeedBin               : boolean;
};



export default function FeedListItem( props : FeedListItemProp ) {
    const { t } = useTranslation();
    const moreOptionsRef = useRef<HTMLDivElement>(null);
    const optionsContainerVisible = props.isSelected || props.commentsActiveId === props.id || props.moreOptionsActiveId === props.id;

    // Feed Bin context options
    const inFeedBinContextOptions : ContextPopupOption[] = [
        { optionTitle: t('feed_item_restore'), icon: '../icons/remove_bin.svg', action: () => {props.setInFeedBin([props.id], false); props.onCloseFeedOptionsPopup();} },
        { optionTitle: t('feed_item_delete_permanently'), icon: '../icons/bin_empty.svg', action: () => { props.deleteFeedItems([props.id]); props.onCloseFeedOptionsPopup(); } },
    ];
    const outFeedBinContextOptions : ContextPopupOption[] = [
        { optionTitle: t('feed_item_move_feed_bin'), icon: '../icons/add_bin.svg', action: () => {props.setInFeedBin([props.id], true); props.onCloseFeedOptionsPopup();} },
    ];

    // Favorite context options
    const inFavoritesContextOptions : ContextPopupOption[] = [
        { optionTitle: t('feed_item_remove_favorite'), icon: '../icons/remove_favorite.svg', action: () => { props.setIsFeedFavorite( props.id, false ); props.onCloseFeedOptionsPopup(); } },
    ];
    const outFavoritesContextOptions : ContextPopupOption[] = [
        { optionTitle: t('feed_item_add_favorite'), icon: '../icons/add_favorite.svg', action: () => { props.setIsFeedFavorite( props.id, true ); props.onCloseFeedOptionsPopup(); } },
    ];

    // Build context menu options
    const feedItemContextOptions : ContextPopupOption[] = [
        { optionTitle: t('open_external_browser'), icon: '../icons/open_external.svg', action: () => {  props.openInExternalBrowser( props.url ); props.onCloseFeedOptionsPopup(); } },
        { optionTitle: t('copy_link'),  icon: '../icons/copy.svg',action: () => { props.copyToClipboard( props.url ); props.onCloseFeedOptionsPopup(); } },

    ]
    .concat(
        ( props.isFavorite )
            ? inFavoritesContextOptions
            : (props.inFeedBin)
                ? [] // Do not show favorite options if item is in bin
                : outFavoritesContextOptions
    )
    .concat(
        ( props.inFeedBin )
            ? inFeedBinContextOptions
            : (props.isFavorite)
                ? [] // Do not show bin options if item is favorited
                : outFeedBinContextOptions
    );

    return (
        <div
            tabIndex={0}
            className={`${styles['feed-item']} ${props.isSelected ? styles.selected : ''} ${props.isRead ? styles.read : ''}`}
            onClick={() => props.onClick(props.id, props.url)}
            onMouseOver={ (e) => {
                props.onMouseOverFeedItem( props.url );
            }}
        >
            {
                (props.favicon)
                    ?   <img
                            title={props.subName}
                            aria-label={props.subName}
                            className={styles["feed-item-favicon"]}
                            src={props.favicon}
                        ></img>
                    : ''
            }
            <div className={styles["feed-item-title"]} title={props.summary ?? props.title } aria-label={props.summary ?? props.title}>{props.title}</div>

            <div className={`${styles['feed-item-options-container']} ${optionsContainerVisible ? styles.visible : ''}`}>
                {
                    props.commentsUrl
                        ?
                            <div
                                className={`${styles['feed-item-options-container']} ${props.commentsActiveId === props.id ? styles.selected : ''}`}
                                onClick={(e) => props.onCommentsClick( props.id, props.url, props.commentsUrl, e )}
                                onMouseOver={ (e) => {
                                    props.onMouseOverFeedItem( props.commentsUrl )
                                }}
                            >
                                {
                                    props.commentsUrl
                                        ?
                                            <div
                                                className={styles['feed-item-option']}
                                                aria-label={t('comments')}
                                                title={t('comments')}
                                            >
                                                <img src={'../icons/comments.svg'}></img>
                                            </div>
                                        : ''
                                }
                            </div>
                        : ''
                }

                <div
                    className={`${styles[`feed-item-options-container`]}`}
                    onClick={(e) => { e.stopPropagation(); props.onMarkReadClick( props.id, e );}}
                >
                    <div
                        className={styles[`feed-item-option`]}
                        title={t('feed_item_mark_read')}
                        aria-label={t('feed_item_mark_read')}
                    >
                        <img
                            src={
                                (props.isRead)
                                    ? '../icons/check_disabled.svg'
                                    : '../icons/check.svg'
                            }
                        ></img>
                    </div>
                </div>

                <div
                    ref={moreOptionsRef}
                    className={`${styles['feed-item-options-container']} ${props.moreOptionsActiveId === props.id ? styles.selected : ''}`}
                    onClick={(e) => { e.stopPropagation(); props.onMoreOptionsClick( props.id, props.url, e );}}
                >

                    <div
                        title={t('feed_item_more_options')}
                        className={styles['feed-item-option']}
                    >
                        <img src={'../icons/v_dots.svg'}></img>
                    </div>
                    {
                        (props.moreOptionsActiveId === props.id)
                            ?   <ContextPopup
                                    anchorRef={moreOptionsRef}
                                    alignment="top"
                                    onClose={props.onCloseFeedOptionsPopup}
                                    options={feedItemContextOptions}
                                ></ContextPopup>
                            : ''
                    }
                </div>
            </div>
        </div>
    );
}