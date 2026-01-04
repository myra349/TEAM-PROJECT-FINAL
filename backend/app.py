from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# ---- CSV SAFE PATH (NO ERRORS) ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "faculty_feedback_2000.csv")

df = pd.read_csv(csv_path)

# ---- ROUTES ----

@app.route("/faculties", methods=["GET"])
def get_faculties():
    faculties = sorted(df["faculty_id"].unique().tolist())
    return jsonify(faculties)

@app.route("/faculty/<fid>", methods=["GET"])
def faculty_details(fid):
    data = df[df["faculty_id"] == fid]

    avg_scores = (
        data.iloc[:, 3:-1]
        .mean()
        .round(2)
        .to_dict()
    )

    comments = data["feedback_comment"].sample(5).tolist()

    return jsonify({
        "faculty_id": fid,
        "subject": data["subject"].iloc[0],
        "average_scores": avg_scores,
        "sample_comments": comments
    })

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    scores = (
        df.groupby("faculty_id")
        .iloc[:, 3:-1]
        .mean()
        .mean(axis=1)
        .sort_values(ascending=False)
        .head(5)
        .round(2)
        .to_dict()
    )
    return jsonify(scores)

# ---- MAIN ----
if __name__ == "__main__":
    app.run(debug=True)









