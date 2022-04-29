export class Result {
    username: string[];
    filename: string[];
    score: number[];
    constructor(
        username1: string, username2: string, filename1: string,
        filename2: string, score1: number, score2: number) {
        this.username = new Array(username1, username2);
        this.filename = new Array(filename1, filename2);
        this.score = new Array(score1, score2);
    }
    availavle(): boolean {
        if (this.username[0] === this.username[1]) {
            return false;
        }
        if (this.score[0] > 84.99 || this.score[1] > 84.99) {
            return true;
        }
        if (this.score[0] > 79.99 && this.score[1] > 79.99) {
            return true;
        }
        return false;
    }
}
