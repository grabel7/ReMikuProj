﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using mikuProj.API.Data;

#nullable disable

namespace mikuProj.API.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20231003041555_playlist7")]
    partial class playlist7
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.11");

            modelBuilder.Entity("MusicPlaylist", b =>
                {
                    b.Property<int>("MusicsSongId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("PlaylistsPlaylistId")
                        .HasColumnType("INTEGER");

                    b.HasKey("MusicsSongId", "PlaylistsPlaylistId");

                    b.HasIndex("PlaylistsPlaylistId");

                    b.ToTable("PlaylistMusic", (string)null);
                });

            modelBuilder.Entity("mikuProj.API.Models.Music", b =>
                {
                    b.Property<int>("SongId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Channel")
                        .HasColumnType("TEXT");

                    b.Property<string>("ChannelId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool?>("Favorite")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Language")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("UserUploaded")
                        .HasColumnType("TEXT");

                    b.Property<string>("VideoId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("VideoName")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("VideoUploaded")
                        .HasColumnType("TEXT");

                    b.Property<string>("Views")
                        .HasColumnType("TEXT");

                    b.HasKey("SongId");

                    b.ToTable("Musics");
                });

            modelBuilder.Entity("mikuProj.API.Models.Playlist", b =>
                {
                    b.Property<int>("PlaylistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("PlaylistId");

                    b.ToTable("Playlists");
                });

            modelBuilder.Entity("MusicPlaylist", b =>
                {
                    b.HasOne("mikuProj.API.Models.Music", null)
                        .WithMany()
                        .HasForeignKey("MusicsSongId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("mikuProj.API.Models.Playlist", null)
                        .WithMany()
                        .HasForeignKey("PlaylistsPlaylistId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
