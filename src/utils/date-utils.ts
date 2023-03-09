export class DateUtils {
  /**
   * Return the updatedAt date of the doc directory
   *
   * @param {*} mtimeMs
   * @returns date
   */
  static getUpdatedAtDoc(mtimeMs: number): string {
    return new Date(mtimeMs).toISOString();
  }
}
