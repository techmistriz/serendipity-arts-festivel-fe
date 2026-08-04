# Editorial Arts Chronicle

I want you to redesign the complete Serendipity Arts Festival website.

Do not design this as a typical festival website.

Design it like a contemporary editorial publication mixed with a high-end design studio portfolio.

Think:

 Swiss Editorial

 Studio Freight

 Alex Vonn

 Bureau Borsche

 Kikk Festival

 Porto Rocha

 Experimental but elegant

The feeling should be calm, confident and sophisticated.

Lots of whitespace.

Nothing decorative.

Typography should carry the identity.

Photography should become the artwork.

Every page should feel like an exhibition catalogue.

Typography

Typography is the hero.

Very large headlines.

Very restrained body copy.

Everything aligns to a strict grid.

Large margins.

No unnecessary icons.

No gradients.

No shadows.

No glassmorphism.

No neumorphism.

Use typography as architecture.

The typography should breathe.

Text Lockups

Never create three stacked paragraphs.

Every section follows this structure only.

Section Label

Short supporting paragraph

One continuous large editorial text lockup.

Example

PROGRAMMES

Over 300 events across visual arts, music, craft, theatre, photography, design and public art.

Discover exhibitions, performances, conversations, workshops and unexpected encounters unfolding across Panjim over eight days.

Everything after that should remain one continuous paragraph.

Never split the large lockup.

Layout

12-column responsive grid.

Large whitespace.

Editorial rhythm.

Alternating image-heavy and typography-heavy sections.

Images can bleed off the screen.

Text should never feel boxed.

Homepage

Hero should immediately communicate scale.

Huge typography.

SERENDIPITY
ARTS
FESTIVAL
2026

Below that:

One editorial paragraph.

Then one continuous lockup introducing this year's festival.

Below:

Featured Programmes

Large image cards

Minimal metadata

Date

Venue

Category

Hover animation only.

Featured Curators

Editorial portraits.

No cards.

Just portrait + name + discipline.

Festival Themes

Large typographic section.

No icons.

Every theme behaves like a magazine headline.

Venues

Large photography.

Venue name.

One editorial sentence.

Statistics

300+ Programmes

35+ Curators

15+ Venues

8 Days

Displayed as typography only.

No counters.

Footer

Minimal.

No heavy footer.

Just navigation.

Newsletter.

Socials.

Credits.

Navigation

Minimal sticky navigation.

Logo left.

Menu right.

Menu opens into a full-screen editorial navigation.

Large typography.

Each menu item occupies significant space.

Home

Programmes

Curators

Venues

Festival Map

Dashboard

About

Programme Listing Page

This page should behave like an exhibition archive.

Not like Eventbrite.

Large heading.

Editorial introduction.

Below:

Sticky filter bar.

Filters

Date

Time

Venue

Category

Performance

Exhibition

Workshop

Talk

Film Screening

Walkthrough

Themes

Free

18+

Photography

Music

Design

Craft

Family

Accessibility

Search

Filters should animate smoothly.

Programme cards should feel like magazine layouts.

Large image.

Title.

Curator.

Venue.

Date.

Category.

Never enclosed in heavy cards.

Hover reveals more information.

Programme Detail Page

Hero image.

Large title.

Metadata aligned horizontally.

Date

Time

Venue

Language

Duration

Accessibility

Below:

One editorial overview.

Then:

Sticky booking panel on desktop.

Exactly like the first reference image.

The booking panel should contain

Date

Time

Venue

Price

Availability

CTA

Book Programme

or

Register Free

Panel remains visible while scrolling.

Registration Flow

If programme is free

Click Register

Open a clean registration modal.

Very minimal.

Fields

Name

Email

Phone

Country

City

Gender

Interests

One page only.

If user already has an account

Automatically prefill everything.

Paid Booking Flow

If user clicks Book

First check

Is user logged in?

If no

Open a minimal registration/login modal.

Prefill existing users.

Then continue.

Proceed to Razorpay checkout.

After payment

Automatically redirect to Dashboard.

Booking Conflict Logic

If a user books another programme that overlaps

Compare

Date

Start Time

End Time

Venue

If another programme overlaps

Display a non-blocking editorial warning.

Example

"This programme overlaps with another booking already in your schedule."

Allow users to continue anyway.

Dashboard

Editorial dashboard.

Large heading.

Hello Ritik.

Below

Upcoming Bookings

Past Programmes

Wishlist

Saved Programmes

Invoices

Art Pass QR

Minimal.

Everything typography-led.

Curators Page

Large editorial portraits.

No cards.

Portrait.

Name.

Discipline.

Click opens profile.

Profile contains

Biography

Programmes

Gallery

Publications

One continuous editorial text lockup.

Venue Page

Large photography.

Minimal metadata.

Editorial introduction.

Google Map.

Programmes happening here.

Accessibility.

Directions.

Nearby Venues.

Visual Language

White backgrounds.

Black typography.

One accent colour only.

Serendipity Pink.

No rounded UI everywhere.

Only subtle radius where required.

Thin borders.

Lots of whitespace.

Motion

Slow.

Elegant.

Editorial.

Fade.

Slide.

Parallax only on photography.

No bouncing.

No exaggerated easing.

Hover animations should feel premium.

Mobile

Everything should collapse into large editorial sections.

Typography remains dominant.

Filters become bottom sheets.

Booking panel becomes sticky bottom CTA.

Dashboard becomes timeline based.

Accessibility

WCAG AA compliant.

Keyboard navigation.

High contrast.

Screen reader friendly.

Reduced motion support.

Large tap targets.

Overall Feeling

The website should feel like reading an internationally recognised art magazine rather than browsing an event platform.

It should communicate confidence through restraint.

Every page should feel curated.

Typography should be the primary design element.

Photography should act as the exhibition.

Nothing should feel templated or generic.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://editorial-arts-archive.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2688de6e-17eb-42ef-9aeb-2c2d364374cd).

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
