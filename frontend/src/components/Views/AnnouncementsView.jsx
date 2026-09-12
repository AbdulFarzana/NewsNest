import React, { useEffect, useRef, useState } from "react";
import {
  Megaphone,
  PlusCircle,
  Info,
  Trash2,
  Image,
  Link,
  ExternalLink,
  Loader2,
  X,
  Upload,
  FileImage
} from "lucide-react";

const API_URL = "https://newsnest-74bb.onrender.com/api/announcements";
const SERVER_URL = "https://newsnest-74bb.onrender.com";

export default function AnnouncementsView({
  currentUser,
  searchQuery = ""
}) {
  const [announcements, setAnnouncements] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [link, setLink] = useState("");

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const imageInputRef = useRef(null);

  const categories = [
    "All",
    "Mid Exams",
    "Semester Exams",
    "College Updates",
    "Company Drives",
    "Placements",
    "General"
  ];

  // GET ANNOUNCEMENTS

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Server response:", text);

        throw new Error(
          "Server returned an invalid response. Check the backend server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch announcements"
        );
      }

      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error(
        "Fetch announcements error:",
        error
      );

      setError(
        error.message ||
        "Failed to load announcements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // IMAGE SELECTION

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");

      e.target.value = "";
      return;
    }

    setError("");

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  // REMOVE IMAGE

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // RESET FORM

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("General");
    setLink("");

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // CREATE ANNOUNCEMENT

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(
        "Please enter an announcement title."
      );
      return;
    }

    if (!content.trim()) {
      setError(
        "Please enter announcement details."
      );
      return;
    }

    try {
      setPosting(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "content",
        content.trim()
      );

      formData.append(
        "category",
        category
      );

      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

      if (link.trim()) {
        formData.append(
          "link",
          link.trim()
        );
      }

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(
          "Backend returned:",
          text
        );

        throw new Error(
          "Backend returned an invalid response. Check the backend terminal."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create announcement"
        );
      }

      if (data.announcement) {
        setAnnouncements((prev) => [
          data.announcement,
          ...prev
        ]);
      } else {
        await fetchAnnouncements();
      }

      resetForm();

      setShowForm(false);

      setSuccess(
        "Announcement published successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Create announcement error:",
        error
      );

      setError(
        error.message ||
        "Failed to create announcement"
      );
    } finally {
      setPosting(false);
    }
  };

  // DELETE ANNOUNCEMENT

  const handleDeleteAnnouncement = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete announcement"
        );
      }

      setAnnouncements((prev) =>
        prev.filter((ann) => {
          const announcementId =
            ann.id || ann._id;

          return (
            announcementId?.toString() !==
            id?.toString()
          );
        })
      );

      setSuccess(
        "Announcement deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Delete announcement error:",
        error
      );

      setError(
        error.message ||
        "Failed to delete announcement"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // FORMAT DATE

  const formatDate = (date) => {
    if (!date) {
      return "Just now";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  // CHECK OWNER

  const isAnnouncementOwner = (
    announcement
  ) => {
    if (
      !currentUser ||
      !announcement
    ) {
      return false;
    }

    const currentUserId =
      currentUser._id ||
      currentUser.id;

    const announcementUserId =
      announcement.user ||
      announcement.userId ||
      announcement.createdBy;

    if (
      !currentUserId ||
      !announcementUserId
    ) {
      return false;
    }

    const actualAnnouncementUserId =
      typeof announcementUserId ===
        "object"
        ? announcementUserId._id ||
        announcementUserId.id
        : announcementUserId;

    if (!actualAnnouncementUserId) {
      return false;
    }

    return (
      currentUserId.toString() ===
      actualAnnouncementUserId.toString()
    );
  };

  // IMAGE URL

  const getAnnouncementImageUrl = (
    announcement
  ) => {
    if (!announcement) {
      return "";
    }

    const announcementId =
      announcement._id ||
      announcement.id;

    if (
      announcement.image &&
      typeof announcement.image === "string"
    ) {
      if (
        announcement.image.startsWith("http://") ||
        announcement.image.startsWith("https://")
      ) {
        return announcement.image;
      }

      if (
        announcement.image.startsWith("/")
      ) {
        return `${SERVER_URL}${announcement.image}`;
      }

      return announcement.image;
    }

    if (
      announcement.imageUrl &&
      typeof announcement.imageUrl === "string"
    ) {
      if (
        announcement.imageUrl.startsWith("http://") ||
        announcement.imageUrl.startsWith("https://")
      ) {
        return announcement.imageUrl;
      }

      return `${SERVER_URL}${announcement.imageUrl}`;
    }

    if (
      announcement.imageId &&
      announcementId
    ) {
      return `${API_URL}/${announcementId}/image`;
    }

    return "";
  };

  // FILTER

  const filteredAnnouncements =
    announcements.filter((ann) => {
      const announcementCategory =
        ann.category || "General";

      const matchesCategory =
        activeCategory === "All" ||
        announcementCategory ===
        activeCategory;

      const search =
        searchQuery
          .toLowerCase()
          .trim();

      if (!search) {
        return matchesCategory;
      }

      const titleText =
        ann.title || "";

      const contentText =
        ann.content || "";

      const categoryText =
        ann.category || "";

      const userNameText =
        ann.userName || "";

      return (
        matchesCategory &&
        (
          titleText
            .toLowerCase()
            .includes(search) ||

          contentText
            .toLowerCase()
            .includes(search) ||

          categoryText
            .toLowerCase()
            .includes(search) ||

          userNameText
            .toLowerCase()
            .includes(search)
        )
      );
    });

  // CATEGORY STYLE

  const getCategoryStyle = (
    categoryName
  ) => {
    switch (categoryName) {
      case "Mid Exams":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";

      case "Semester Exams":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      case "Company Drives":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "Placements":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "College Updates":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">

            <Megaphone className="w-5 h-5 text-indigo-400" />

            <span>
              College Announcements
            </span>

          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Stay updated with exams, college notices,
            placement drives and important updates.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setError("");
          }}
          className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          {showForm ? (
            <X className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}

          <span>
            {showForm
              ? "Cancel"
              : "Post Announcement"}
          </span>
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-xs">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-xs">
          {success}
        </div>
      )}

      {/* CREATE FORM */}

      {showForm && (

        <div className="bg-[#111827] border border-indigo-500/20 rounded-3xl p-5 shadow-xl">

          <h3 className="text-sm font-bold text-white mb-1">
            Post New Announcement
          </h3>

          <p className="text-[11px] text-gray-500 mb-5">
            Share exam schedules, college updates,
            company drives and important links.
          </p>

          <form
            onSubmit={handleCreateAnnouncement}
            className="space-y-4"
          >

            {/* TITLE */}

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                Announcement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Mid Semester Examination Schedule"
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Mid Exams">
                  Mid Exams
                </option>

                <option value="Semester Exams">
                  Semester Exams
                </option>

                <option value="College Updates">
                  College Updates
                </option>

                <option value="Company Drives">
                  Company Drives
                </option>

                <option value="Placements">
                  Placements
                </option>

                <option value="General">
                  General
                </option>
              </select>
            </div>

            {/* CONTENT */}

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                Announcement Details
              </label>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write the complete announcement details..."
                rows={5}
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* IMAGE UPLOAD */}

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2 flex items-center gap-2">

                <Image className="w-3.5 h-3.5 text-indigo-400" />

                Announcement Image

              </label>

              {!imageFile ? (

                <label
                  htmlFor="announcement-image"
                  className="flex flex-col items-center justify-center w-full min-h-[150px] bg-[#151c2c] border border-dashed border-[#374151] hover:border-indigo-500 rounded-2xl cursor-pointer transition-all group"
                >

                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-all">

                    <Upload className="w-5 h-5 text-indigo-400" />

                  </div>

                  <p className="text-xs font-semibold text-gray-300">
                    Choose an image from your computer
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    JPG, JPEG, PNG, WEBP • Maximum 10 MB
                  </p>

                  <input
                    ref={imageInputRef}
                    id="announcement-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

              ) : (

                <div className="bg-[#151c2c] border border-[#1f2937] rounded-2xl p-3">

                  <div className="flex items-center justify-between mb-3">

                    <div className="flex items-center gap-2 min-w-0">

                      <FileImage className="w-4 h-4 text-indigo-400 shrink-0" />

                      <div className="min-w-0">

                        <p className="text-xs text-gray-300 font-medium truncate">
                          {imageFile.name}
                        </p>

                        <p className="text-[10px] text-gray-500">
                          {(
                            imageFile.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>

                  </div>

                  {imagePreview && (
                    <div className="rounded-xl overflow-hidden border border-[#1f2937] bg-black/20">

                      <img
                        src={imagePreview}
                        alt="Selected announcement"
                        className="w-full max-h-[350px] object-contain"
                      />

                    </div>
                  )}

                </div>

              )}

            </div>

            {/* LINK */}

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2 flex items-center gap-2">

                <Link className="w-3.5 h-3.5 text-indigo-400" />

                Registration / Drive Link

              </label>

              <input
                type="url"
                value={link}
                onChange={(e) =>
                  setLink(e.target.value)
                }
                placeholder="https://forms.google.com/..."
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

              <p className="text-[10px] text-gray-500 mt-1.5">
                Useful for company applications,
                registration forms and drive links.
              </p>

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setError("");
                }}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={posting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >

                {posting && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}

                {posting
                  ? "Publishing..."
                  : "Publish Announcement"}

              </button>

            </div>

          </form>

        </div>

      )}

      {/* CATEGORY TABS */}

      <div className="flex items-center justify-between border-b border-[#1f2937]/50 pb-2 overflow-x-auto">

        <div className="flex gap-2 min-w-max">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() =>
                setActiveCategory(cat)
              }
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${activeCategory === cat
                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                : "bg-transparent border-transparent text-gray-400 hover:text-white"
                }`}
            >
              {cat}
            </button>

          ))}

        </div>

        <span className="text-[10px] text-gray-500 font-mono ml-4 whitespace-nowrap">
          Found{" "}
          {filteredAnnouncements.length}
        </span>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="flex justify-center py-16">

          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />

        </div>

      )}

      {/* ANNOUNCEMENTS */}

      {!loading && (

        <div className="space-y-4">

          {filteredAnnouncements.length === 0 ? (

            <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-3xl p-5 text-gray-500 text-xs">
              No announcements found.
            </div>

          ) : (

            filteredAnnouncements.map((ann) => {

              const announcementId =
                ann.id || ann._id;

              const owner =
                isAnnouncementOwner(ann);

              const announcementImage =
                getAnnouncementImageUrl(ann);

              return (

                <div
                  key={announcementId}
                  className="bg-[#111827] border border-[#1f2937] rounded-3xl p-5 md:p-6 hover:border-indigo-500/20 transition-all shadow-sm space-y-4"
                >

                  {/* TOP */}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937]/50 pb-3">

                    <div className="flex flex-wrap items-center gap-2">

                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getCategoryStyle(
                          ann.category
                        )}`}
                      >
                        {ann.category ||
                          "General"}
                      </span>

                      <span className="text-[11px] text-gray-500 font-medium">
                        Published{" "}
                        {formatDate(
                          ann.createdAt ||
                          ann.publishedAt
                        )}
                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      {ann.userName && (

                        <span className="text-xs text-gray-300 font-semibold px-2.5 py-1 bg-[#151c2c] border border-[#1f2937] rounded-xl">
                          Posted by{" "}
                          {ann.userName}
                        </span>

                      )}

                      {owner && (

                        <button
                          onClick={() =>
                            handleDeleteAnnouncement(
                              announcementId
                            )
                          }
                          disabled={
                            deletingId ===
                            announcementId
                          }
                          className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete Announcement"
                        >

                          {deletingId ===
                            announcementId ? (

                            <Loader2 className="w-4 h-4 animate-spin" />

                          ) : (

                            <Trash2 className="w-4 h-4" />

                          )}

                        </button>

                      )}

                    </div>

                  </div>

                  {/* TITLE + CONTENT */}

                  <div className="space-y-2">

                    <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                      {ann.title}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed whitespace-pre-line select-text">
                      {ann.content}
                    </p>

                  </div>

                  {/* IMAGE */}

                  {announcementImage && (

                    <div className="rounded-2xl overflow-hidden border border-[#1f2937] bg-[#151c2c]">

                      <img
                        src={announcementImage}
                        alt={
                          ann.title ||
                          "Announcement"
                        }
                        className="w-full max-h-[500px] object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>

                  )}

                  {/* LINK */}

                  {ann.link && (

                    <a
                      href={ann.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-3 hover:bg-indigo-500/10 transition-colors"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">

                          <Link className="w-4 h-4 text-indigo-400" />

                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-semibold text-indigo-300">
                            Registration / Application Link
                          </p>

                          <p className="text-[10px] text-gray-500 truncate">
                            {ann.link}
                          </p>

                        </div>

                      </div>

                      <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0" />

                    </a>

                  )}

                  {/* INFO */}

                  <div className="flex items-start gap-2 text-[10px] text-gray-500 bg-[#151c2c]/30 rounded-xl p-2.5 border border-[#1f2937]/50">

                    <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />

                    <span>
                      This announcement was posted
                      by a registered college community
                      user.
                    </span>

                  </div>

                </div>

              );

            })

          )}

        </div>

      )}

    </div>
  );
}