# Predictive Defender

Build a polished, professional web application for the following problem:

PROJECT:

Predictive Cyber Defence using AI World Models

GOAL:

Build a cybersecurity analysis platform that does not only detect malicious traffic, but models how network states evolve over time and forecasts future attack progression before compromise is complete.

IMPORTANT SCOPE:

Implement ONLY the functionality required by the problem statement. Do not add unnecessary innovation features such as zero-day detection, threat-intelligence feeds, CVE integration, automated response, blockchain, adaptive simulation horizons, role-based dashboards, etc.

The application should be a convincing functional prototype/demo for an academic cybersecurity/AI project.

==================================================

1. OVERALL UI/UX

==================================================

Create a modern cybersecurity dashboard with a clean professional appearance.

Design style:

- Dark navy / charcoal cybersecurity theme

- Blue and cyan accent colors

- Clean cards with subtle borders

- Professional typography

- Good spacing and hierarchy

- Minimal animations

- Responsive desktop-first layout

- Avoid excessive neon/glow effects

- The UI should look like a serious security analytics product, not a gaming dashboard.

Use icons consistently for:

- Network traffic

- PCAP

- Database

- AI model

- Prediction

- Explainability

- Attack stages

- Benchmarking

Main navigation/sidebar:

1. Overview

2. Traffic Analysis

3. Feature Extraction

4. World Model

5. Prediction

6. Explainability

7. Benchmarking

==================================================

2. OVERVIEW / HOME DASHBOARD

==================================================

Create an overview dashboard showing the complete system pipeline.

Top header:

"Predictive Cyber Defence"

"AI World Model for Forecasting Network Attack Progression"

Show a visual pipeline:

Network Traffic

↓

Feature Extraction

↓

Network State

↓

AI World Model

↓

Future Prediction

↓

Explainability

↓

Defender Dashboard

Add summary cards:

- Current Network State

- Infiltration Probability

- Predicted Attack Stage

- Active/Flagged Flows

Create a large "Attack Progression Timeline" chart.

Show stages:

Reconnaissance → Initial Access → Lateral Movement → Command & Control → Exfiltration

Clearly distinguish:

- Current stage

- Predicted stage

- Future stages

Use realistic DEMO DATA initially so the application looks populated when opened.

==================================================

3. TRAFFIC ANALYSIS

==================================================

Create a page for network traffic input.

Allow:

- Upload PCAP

- Upload CSV

- Select demo dataset

Show:

Input File

File Type

Number of Flows

Time Range

Packets

Bytes

Protocols

Add a "Run Analysis" button.

For the prototype, support simulated/demo processing if a real ML backend is unavailable.

Do NOT pretend that a real AI model has run if it has not.

Clearly label simulated/demo results as "Demo Analysis" where appropriate.

==================================================

4. FEATURE EXTRACTION

==================================================

Create a feature extraction page showing how raw traffic is converted into model-ready data.

Display two sections.

FLOW-LEVEL FEATURES:

- Source IP

- Destination IP

- Source Port

- Destination Port

- Protocol

- TCP Flags

- Packets

- Bytes

- Flow Duration

- Inter-arrival Time

- Inbound/Outbound Ratio

PACKET-LEVEL FEATURES:

- TTL

- TCP Window Size

- Payload Size

- Fragmentation

- Retransmissions

- Port Scan Pattern

Show a sample feature table.

Columns:

Timestamp

Source

Destination

Protocol

Port

Packets

Bytes

Duration

TCP Flags

Label

Add a visual preprocessing pipeline:

Raw Traffic

→ Parsing

→ Feature Extraction

→ Normalization

→ Timestamp Alignment

→ Time Windows

==================================================

5. NETWORK STATE REPRESENTATION

==================================================

Create a section showing how extracted features become a network state.

Provide two visual representations:

A. FEATURE VECTOR

Show a simplified vector:

[SYN rate, packet rate, bytes, duration, TTL variance, port activity, ...]

B. NETWORK GRAPH

Visualize:

- Nodes = IP addresses / ports

- Edges = network flows

- Edge thickness = traffic volume

Allow the user to switch between:

"Feature Vector"

and

"Network Graph"

Do not add unnecessary graph functionality.

==================================================

6. AI WORLD MODEL

==================================================

Create a dedicated page explaining and visualizing the world model.

Title:

"AI World Model"

Subtitle:

"Learning how network states evolve over time"

Show:

Current Network State Sₜ

↓

Temporal Dynamics Model

↓

P(Sₜ₊₁ | Sₜ)

↓

Future Network State Sₜ₊₁

Show model options:

- LSTM

- Temporal Transformer

- Graph Neural Network

For the prototype, select one model as the active demo model and show the others as candidate architectures.

Display:

Current State

→ State +1

→ State +2

→ State +3

→ State +K

Create a simple temporal visualization showing how the network state changes over time.

==================================================

7. PREDICTION ENGINE

==================================================

Create a prediction page.

Main section:

"K-Step Forward Simulation"

Allow a small selector:

Prediction Horizon:

K = 3 / 5 / 10

Display:

"Infiltration Probability"

Use a line chart:

Time Window

vs

Infiltration Probability

Example demo values:

20%, 27%, 35%, 48%, 63%, 76%

Clearly label these as DEMO/SIMULATED values unless generated by an actual backend model.

Show prediction cards:

Current Stage:

Reconnaissance

Predicted Next Stage:

Initial Access

Future Risk:

High

Predicted Infiltration Probability:

76%

Then show:

Attack Stage Prediction

Reconnaissance

↓

Initial Access

↓

Lateral Movement

↓

Command & Control

↓

Exfiltration

Highlight the predicted/current stage.

==================================================

8. EXPLAINABILITY

==================================================

Create an Explainability page answering:

"Why did the model make this prediction?"

Show a feature contribution chart.

Example:

SYN Flag Rate          ██████████

Destination Port       ████████

Packet Rate            ███████

Flow Duration          █████

TTL Variance           ████

Use SHAP-style feature contribution visualization.

Show a table:

Feature

Value

Contribution

Impact

Example:

SYN Rate

High

+0.24

Increases Risk

Port Activity

High

+0.18

Increases Risk

Flow Duration

Medium

+0.07

Increases Risk

Also show a "Driving Flows" table:

Source IP

Destination IP

Port

Protocol

Risk Contribution

The explanation should connect the model prediction to actual network traffic features.

==================================================

9. DEFENDER DASHBOARD

==================================================

Create a clean final analysis dashboard.

Sections:

A. Infiltration Probability Timeline

B. Current Attack Stage

C. Predicted Attack Stage

D. Flagged Network Flows

E. Top Driving Features

F. Attack Progression

Example alert:

"Elevated probability of progression toward Initial Access."

Do not create automated remediation or response functionality.

The dashboard is for analysis and decision support only.

==================================================

10. BENCHMARKING

==================================================

Create a dedicated benchmarking page.

Compare:

Baseline:

Logistic Regression

vs

Proposed:

AI World Model

Show a comparison table:

Metric | Logistic Regression | World Model

Precision

Recall

F1 Score

False Positive Rate

Use realistic-looking DEMO values, but clearly mark them as:

"Illustrative Demo Results"

Do not claim these are actual experimental results.

Create:

- Bar chart comparing F1

- Precision comparison

- Recall comparison

- False Positive Rate comparison

Add a small explanation:

"The baseline and proposed model are evaluated using the same dataset and evaluation metrics."

==================================================

11. DATASETS

==================================================

Include dataset information in the application.

Datasets:

CIC-IDS-2018

- Network intrusion traffic

- Attack scenarios

CTU-13

- Botnet and normal traffic

Show dataset cards with:

Name

Purpose

Traffic Type

==================================================

12. REQUIRED TECHNICAL FLOW

==================================================

The application must visually communicate this exact architecture:

PCAP / NetFlow

        ↓

Feature Extraction

        ↓

Normalization & Time Windowing

        ↓

Network State Representation

        ↓

AI World Model

        ↓

K-Step Forward Simulation

        ↓

Attack Stage + Infiltration Probability

        ↓

Explainability

        ↓

Defender Dashboard

Benchmarking should compare the AI World Model against Logistic Regression.

==================================================

13. COMPONENTS

==================================================

Use reusable components:

- Sidebar

- Header

- MetricCard

- PipelineStep

- TrafficTable

- FeatureTable

- NetworkGraph

- ProbabilityChart

- AttackStageTimeline

- FeatureContributionChart

- PredictionCard

- BenchmarkTable

- DatasetCard

- StatusBadge

==================================================

14. DEMO EXPERIENCE

==================================================

When the application opens, it should already contain demo data.

The evaluator should be able to:

1. Open Overview

2. See network traffic summary

3. Open Feature Extraction

4. See extracted features

5. See Network State

6. Open AI World Model

7. Run/trigger K-step prediction

8. See infiltration probability

9. See predicted attack stage

10. Open Explainability

11. See why the prediction was made

12. Open Benchmarking

13. Compare Logistic Regression vs World Model

Make this flow smooth and presentation-ready.

==================================================

15. IMPORTANT IMPLEMENTATION RULES

==================================================

Use React with a clean component architecture.

Use a charting library such as Recharts for:

- Probability timeline

- Feature contributions

- Benchmark comparisons

Use mock/demo data initially.

Keep the code structured so that a real Python/PyTorch backend can later replace the demo prediction functions.

Create clear service/API abstraction such as:

trafficService

featureService

worldModelService

predictionService

explainabilityService

benchmarkService

Do not hardcode everything directly into UI components.

==================================================

16. FINAL DESIGN REQUIREMENT

==================================================

The most important thing is clarity.

The evaluator must immediately understand:

"What enters the system?"

"What features are extracted?"

"How is network state represented?"

"How does the world model learn temporal dynamics?"

"How does the system predict future attack progression?"

"Why did it make that prediction?"

"How is performance evaluated?"

The UI should communicate these answers visually without requiring the evaluator to read large amounts of text.

Build the complete frontend with realistic demo data and a polished academic/professional cybersecurity dashboard experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c228c7b3-0aad-443e-a526-c0e6472dd289).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
