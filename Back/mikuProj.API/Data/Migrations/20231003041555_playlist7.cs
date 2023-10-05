using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mikuProj.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class playlist7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Musics_Playlists_PlaylistId",
                table: "Musics");

            migrationBuilder.DropIndex(
                name: "IX_Musics_PlaylistId",
                table: "Musics");

            migrationBuilder.DropColumn(
                name: "PlaylistId",
                table: "Musics");

            migrationBuilder.CreateTable(
                name: "PlaylistMusic",
                columns: table => new
                {
                    MusicsSongId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlaylistsPlaylistId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaylistMusic", x => new { x.MusicsSongId, x.PlaylistsPlaylistId });
                    table.ForeignKey(
                        name: "FK_PlaylistMusic_Musics_MusicsSongId",
                        column: x => x.MusicsSongId,
                        principalTable: "Musics",
                        principalColumn: "SongId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlaylistMusic_Playlists_PlaylistsPlaylistId",
                        column: x => x.PlaylistsPlaylistId,
                        principalTable: "Playlists",
                        principalColumn: "PlaylistId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistMusic_PlaylistsPlaylistId",
                table: "PlaylistMusic",
                column: "PlaylistsPlaylistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlaylistMusic");

            migrationBuilder.AddColumn<int>(
                name: "PlaylistId",
                table: "Musics",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Musics_PlaylistId",
                table: "Musics",
                column: "PlaylistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Musics_Playlists_PlaylistId",
                table: "Musics",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "PlaylistId");
        }
    }
}
