export class VimeoDetailsDto implements IVimeoDetailsDto {

    duration!: string | undefined;
    embed_privacy!: string | undefined;
    height!: number | undefined;
    id!: string | undefined;
    stats_number_of_comments!: number | undefined;
    stats_number_of_likes!: number | undefined;
    stats_number_of_plays!: number | undefined;
    tags!: string | undefined;
    thumbnail_large!: string | undefined;
    thumbnail_medium!: string | undefined;
    thumbnail_small!: string | undefined;
    title!: string | undefined;
    upload_date!: string | undefined;
    url!: string | undefined;
    user_name!: string | undefined;
    user_portrait_huge!: string | undefined;
    user_portrait_large!: string | undefined;
    user_portrait_medium!: string | undefined;
    user_portrait_small!: string | undefined;
    user_url!: string | undefined;
    width!: number | undefined;

    constructor(data?: IVimeoDetailsDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.duration = _data["duration"];
            this.embed_privacy = _data["embed_privacy"];
            this.height = _data["height"];
            this.id = _data["id"];
            this.stats_number_of_comments = _data["stats_number_of_comments"];
            this.stats_number_of_likes = _data["stats_number_of_likes"];
            this.stats_number_of_plays = _data["stats_number_of_plays"];
            this.tags = _data["tags"];
            this.thumbnail_large = _data["thumbnail_large"];
            this.thumbnail_medium = _data["thumbnail_medium"];
            this.thumbnail_small = _data["thumbnail_small"];
            this.title = _data["title"];
            this.upload_date = _data["upload_date"];
            this.url = _data["url"];
            this.user_name = _data["user_name"];
            this.user_portrait_huge = _data["user_portrait_huge"];
            this.user_portrait_large = _data["user_portrait_large"];
            this.user_portrait_medium = _data["user_portrait_medium"];
            this.user_portrait_small = _data["user_portrait_small"];
            this.user_url = _data["user_url"];
            this.width = _data["width"];
        }
    }

    static fromJS(data: any): VimeoDetailsDto {
        data = typeof data === 'object' ? data : {};
        let result = new VimeoDetailsDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any): any {
        data = typeof data === 'object' ? data : {};
        data["duration"] = this.duration;
        data["embed_privacy"] = this.embed_privacy;
        data["height"] = this.height;
        data["id"] = this.id;
        data["stats_number_of_comments"] = this.stats_number_of_comments;
        data["stats_number_of_likes"] = this.stats_number_of_likes;
        data["stats_number_of_plays"] = this.stats_number_of_plays;
        data["tags"] = this.tags;
        data["thumbnail_large"] = this.thumbnail_large;
        data["thumbnail_medium"] = this.thumbnail_medium;
        data["thumbnail_small"] = this.thumbnail_small;
        data["title"] = this.title;
        data["upload_date"] = this.upload_date;
        data["url"] = this.url;
        data["user_name"] = this.user_name;
        data["user_portrait_huge"] = this.user_portrait_huge;
        data["user_portrait_large"] = this.user_portrait_large;
        data["user_portrait_medium"] = this.user_portrait_medium;
        data["user_portrait_small"] = this.user_portrait_small;
        data["user_url"] = this.user_url;
        data["width"] = this.width;
        return data;
    }
}

export interface IVimeoDetailsDto {
    duration: string | undefined;
    embed_privacy: string | undefined;
    height: number | undefined;
    id: string | undefined;
    stats_number_of_comments: number | undefined;
    stats_number_of_likes: number | undefined;
    stats_number_of_plays: number | undefined;
    tags: string | undefined;
    thumbnail_large: string | undefined;
    thumbnail_medium: string | undefined;
    thumbnail_small: string | undefined;
    title: string | undefined;
    upload_date: string | undefined;
    url: string | undefined;
    user_name: string | undefined;
    user_portrait_huge: string | undefined;
    user_portrait_large: string | undefined;
    user_portrait_medium: string | undefined;
    user_portrait_small: string | undefined;
    user_url: string | undefined;
    width: number | undefined;
}