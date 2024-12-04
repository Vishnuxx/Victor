export enum NotifyMeActions {
	ENABLE_TARGET_SELECTION,
	TARGET_SELECTED,
	DISABLE_TARGET_SELECTION,
	TARGET_CONTENT,
}

export type TargetContent =  {
    url : string
    title : string
    content : string
    xpath : string | null
}